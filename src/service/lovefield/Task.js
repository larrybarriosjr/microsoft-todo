import lf from "lovefield"
import { buildSchema, tblTasks, tblSteps } from "service/lovefield/schema"
import { Step } from "service/lovefield/Step"
import { v4 as uuid } from "uuid"

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
      notes,
      listId
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
      myDay: !!myDay,
      completed: false,
      starred: !!starred,
      notes: "",
      dueDate: dueDate || null,
      reminder: null,
      listId: listId || null,
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
