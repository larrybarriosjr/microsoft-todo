import lf from "lovefield"
import { v4 as uuid } from "uuid"

const buildSchema = () => {
  const schemaBuilder = lf.schema.create("ms-todo", 1)

  schemaBuilder
    .createTable("tasks")

    .addColumn("id", lf.Type.STRING)
    .addColumn("name", lf.Type.STRING)
    .addColumn("myDay", lf.Type.BOOLEAN)
    .addColumn("completed", lf.Type.BOOLEAN)
    .addColumn("starred", lf.Type.BOOLEAN)
    .addColumn("dueDate", lf.Type.DATE_TIME)
    .addColumn("reminder", lf.Type.DATE_TIME)
    .addColumn("notes", lf.Type.STRING)
    .addColumn("stepsTotal", lf.Type.NUMBER)
    .addColumn("stepsCompleted", lf.Type.NUMBER)

    .addColumn("dateCreated", lf.Type.DATE_TIME)
    .addColumn("myDayEdited", lf.Type.DATE_TIME)
    .addColumn("completedEdited", lf.Type.DATE_TIME)
    .addColumn("starredEdited", lf.Type.DATE_TIME)
    .addColumn("dueDateEdited", lf.Type.DATE_TIME)

    .addColumn("listId", lf.Type.STRING)
    .addPrimaryKey(["id"])
    .addNullable(["dueDate", "reminder", "listId"])
    .addForeignKey("fk_task_list", {
      local: "listId",
      ref: "lists.id",
      action: lf.ConstraintAction.CASCADE
    })

  schemaBuilder
    .createTable("steps")
    .addColumn("id", lf.Type.STRING)
    .addColumn("name", lf.Type.STRING)
    .addColumn("completed", lf.Type.BOOLEAN)
    .addColumn("order", lf.Type.NUMBER)
    .addColumn("taskId", lf.Type.STRING)
    .addPrimaryKey(["id"])
    .addForeignKey("fk_step_task", {
      local: "taskId",
      ref: "tasks.id",
      action: lf.ConstraintAction.CASCADE
    })

  schemaBuilder
    .createTable("lists")
    .addColumn("id", lf.Type.STRING)
    .addColumn("name", lf.Type.STRING)
    .addPrimaryKey(["id"])

  return schemaBuilder
}

const tblTasks = buildSchema().getSchema().table("tasks")
const tblSteps = buildSchema().getSchema().table("steps")

const selectTask = (id, db) => {
  const query = db.select().from(tblTasks).where(tblTasks.id.eq(id))
  return query.exec()
}

const indexTask = (db) => {
  const query = db.select().from(tblTasks)
  return query.exec()
}

const insertTask = (data, db) => {
  const dataRow = tblTasks.createRow(data)
  db.insert().into(tblTasks).values([dataRow]).exec()
  return db
}

const updateTask = (data, id, db) => {
  const dataKey = Object.keys(data)[0]
  const dataKeyDate = Object.keys(data)[1]

  db.update(tblTasks)
    .set(tblTasks[dataKey], data[dataKey])
    .where(tblTasks.id.eq(id))
    .exec()

  if (dataKeyDate) {
    db.update(tblTasks)
      .set(tblTasks[dataKeyDate], data[dataKeyDate])
      .where(tblTasks.id.eq(id))
      .exec()
  }

  return db
}

const removeTask = (id, db) => {
  db.delete().from(tblTasks).where(tblTasks.id.eq(id)).exec()
  return db
}

const incrementOrder = (id, db) => {
  const result = db
    .select()
    .from(tblSteps)
    .where(tblSteps.taskId.eq(id))
    .orderBy(tblSteps.order, lf.Order.DESC)
    .exec()
  result.then((res) => (Step._order = res[0] ? res[0].order + 1 : 1))
  return db
}

export const Task = {
  _serialize: (obj) => {
    const {
      id,
      name,
      myDay,
      completed,
      starred,
      dueDate,
      reminder,
      notes
    } = obj

    if (id) {
      if ("name" in obj) return { name }
      if ("myDay" in obj) return { myDay, myDayEdited: new Date() }
      if ("completed" in obj) return { completed, completedEdited: new Date() }
      if ("starred" in obj) return { starred, starredEdited: new Date() }
      if ("dueDate" in obj) return { dueDate, dueDateEdited: new Date() }
      if ("reminder" in obj) return { reminder }
      if ("notes" in obj) return { notes }
    }
    return {
      id: uuid(),
      name: name,
      myDay: true,
      completed: false,
      starred: false,
      notes: "",
      listId: null,
      stepsTotal: 0,
      stepsCompleted: 0,
      dateCreated: new Date(),
      myDayEdited: new Date(),
      completedEdited: new Date(),
      starredEdited: new Date(),
      dueDateEdited: new Date()
    }
  },
  get: async (id) => {
    return buildSchema()
      .connect()
      .then((db) => (typeof id === "undefined" ? db : incrementOrder(id, db)))
      .then((db) =>
        typeof id === "undefined" ? indexTask(db) : selectTask(id, db)
      )
      .then((res) => res)
  },
  post: async (obj) => {
    return buildSchema()
      .connect()
      .then((db) => insertTask(Task._serialize(obj), db))
      .then((db) => indexTask(db))
  },
  patch: async (obj) => {
    return buildSchema()
      .connect()
      .then((db) => updateTask(Task._serialize(obj), obj.id, db))
      .then((db) => indexTask(db))
  },
  delete: async (id) => {
    return buildSchema()
      .connect()
      .then((db) => removeTask(id, db))
      .then((db) => indexTask(db))
  }
}

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

const removeStep = (id, db) => {
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
      .then((db) => removeStep(id, db))
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
