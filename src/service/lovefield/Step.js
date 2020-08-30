import lf from "lovefield"
import { buildSchema, tblSteps, tblTasks } from "service/lovefield/schema"
import { v4 as uuid } from "uuid"

const indexStep = (taskId, db) => {
  const query = db
    .select()
    .from(tblSteps)
    .where(tblSteps.taskId.eq(taskId))
    .orderBy(tblSteps.order)
  return query.exec()
}

const insertStep = async (data, db) => {
  const dataRow = tblSteps.createRow(data)

  const incrementStepsTotal = db
    .update(tblTasks)
    .set(tblTasks.stepsTotal, lf.bind(0))
    .where(tblTasks.id.eq(data.taskId))

  const task = await db
    .select(tblTasks.stepsTotal)
    .from(tblTasks)
    .where(tblTasks.id.eq(data.taskId))
    .exec()

  incrementStepsTotal.bind([task[0].stepsTotal + 1]).exec()

  const result = db.insert().into(tblSteps).values([dataRow]).exec()
  result.then((res) => (Step._order = res[0].order + 1))

  return db
}

const updateStep = async (data, id, taskId, db) => {
  const dataKey = Object.keys(data)[0]

  db.update(tblSteps)
    .set(tblSteps[dataKey], data[dataKey])
    .where(tblSteps.id.eq(id))
    .exec()

  if (dataKey === "completed") {
    let value
    const changeStepsCompleted = db
      .update(tblTasks)
      .set(tblTasks.stepsCompleted, lf.bind(0))
      .where(tblTasks.id.eq(taskId))

    const task = await db
      .select(tblTasks.stepsCompleted)
      .from(tblTasks)
      .where(tblTasks.id.eq(taskId))
      .exec()

    data.completed
      ? (value = task[0].stepsCompleted + 1)
      : (value = task[0].stepsCompleted - 1)

    changeStepsCompleted.bind([value]).exec()
    db.update(tblTasks).set(tblTasks.stepsCompleted)
  }

  return db
}

const removeStep = async (taskId, id, db) => {
  const decrementStepsTotal = db
    .update(tblTasks)
    .set(tblTasks.stepsTotal, lf.bind(0))
    .where(tblTasks.id.eq(taskId))

  const task = await db
    .select(tblTasks.stepsTotal)
    .from(tblTasks)
    .where(tblTasks.id.eq(taskId))
    .exec()

  decrementStepsTotal.bind([task[0].stepsTotal - 1]).exec()
  db.delete().from(tblSteps).where(tblSteps.id.eq(id)).exec()

  return db
}

const getAdjacent = async (taskId, fromOrder, toOrder, db) => {
  if (fromOrder > toOrder) {
    const result = await db
      .select(tblSteps.order)
      .from(tblSteps)
      .where(lf.op.and(tblSteps.order.lt(toOrder), tblSteps.taskId.eq(taskId)))
      .orderBy(tblSteps.order, lf.Order.DESC)
      .exec()
    if (result.length) return [db, result]
    return [db, [{ order: Math.floor(toOrder - 1) }]]
  } else {
    const result = await db
      .select(tblSteps.order)
      .from(tblSteps)
      .where(lf.op.and(tblSteps.order.gt(toOrder), tblSteps.taskId.eq(taskId)))
      .orderBy(tblSteps.order)
      .exec()
    if (result.length) return [db, result]
    return [db, [{ order: Math.ceil(toOrder + 1) }]]
  }
}

const reorderStep = (fromObj, toOrder, res, db) => {
  const order = (toOrder + res[0].order) / 2

  db.update(tblSteps)
    .set(tblSteps.order, order)
    .where(tblSteps.id.eq(fromObj.id))
    .exec()

  return db
}

export const Step = {
  _order: 0,
  _serialize: (obj) => {
    const { id, name, completed, order, taskId } = obj
    if (id) {
      if ("completed" in obj) return { completed }
      if ("order" in obj) return { order }
    }
    return {
      id: uuid(),
      name: name,
      completed: false,
      order: Step._order,
      taskId: taskId
    }
  },
  get: async (taskId) => {
    return buildSchema()
      .connect()
      .then((db) => indexStep(taskId, db))
      .then((res) => res || [])
  },
  post: async (obj) => {
    return buildSchema()
      .connect()
      .then((db) => insertStep(Step._serialize(obj), db))
      .then((db) => indexStep(obj.taskId, db))
  },
  patch: async (taskId, obj) => {
    return buildSchema()
      .connect()
      .then((db) => updateStep(Step._serialize(obj), obj.id, taskId, db))
      .then((db) => indexStep(taskId, db))
  },
  delete: async (taskId, id) => {
    return buildSchema()
      .connect()
      .then((db) => removeStep(taskId, id, db))
      .then((db) => indexStep(taskId, db))
  },
  reorder: async (taskId, fromObj, toOrder) => {
    return buildSchema()
      .connect()
      .then((db) => getAdjacent(taskId, fromObj.order, toOrder, db))
      .then(([db, res]) => reorderStep(fromObj, toOrder, res, db))
      .then((db) => indexStep(taskId, db))
  }
}
