import lf from "lovefield"
import { v4 as uuid } from "uuid"

const buildSchema = () => {
  const schemaBuilder = lf.schema.create("futhark", 1)
  schemaBuilder
    .createTable("tasks")
    .addColumn("id", lf.Type.STRING)
    .addColumn("name", lf.Type.STRING)
    .addColumn("completed", lf.Type.BOOLEAN)
    .addColumn("starred", lf.Type.BOOLEAN)
    .addColumn("steps", lf.Type.ARRAY_BUFFER)
    .addColumn("dueDate", lf.Type.DATE_TIME)
    .addColumn("reminder", lf.Type.DATE_TIME)
    .addColumn("notes", lf.Type.STRING)
    .addColumn("listId", lf.Type.STRING)
    .addPrimaryKey(["id"])
    .addNullable(["steps", "dueDate", "reminder", "listId"])
    .addForeignKey("fk_task_list", {
      local: "listId",
      ref: "lists.id",
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

const select = (id, db) => {
  const query = db.select().from(tblTasks).where(tblTasks.id.eq(id))
  return query.exec()
}

const index = (db) => {
  const query = db.select().from(tblTasks)
  return query.exec()
}

const insert = (data, db) => {
  const dataRow = tblTasks.createRow(data)
  db.insert().into(tblTasks).values([dataRow]).exec()
  return db
}

const update = (data, id, db) => {
  const dataKey = Object.keys(data)[0]
  db.update(tblTasks)
    .set(tblTasks[dataKey], data[dataKey])
    .where(tblTasks.id.eq(id))
    .exec()
  return db
}

export const Task = {
  _serialize: (obj) => {
    if (obj.taskId) {
      if (obj.taskName) return { name: obj.taskName }
      if (obj.taskCompleted) return { completed: obj.taskCompleted }
      if (obj.taskStarred) return { starred: obj.taskStarred }
      if (obj.taskSteps) return { steps: obj.taskSteps }
      if (obj.taskDueDate) return { dueDate: obj.taskDueDate }
      if (obj.taskReminder) return { reminder: obj.taskReminder }
      if (obj.taskNotes) return { notes: obj.taskNotes }
    }
    return {
      id: uuid(),
      name: obj.taskName,
      completed: false,
      starred: false,
      steps: null,
      notes: "",
      listId: null
    }
  },
  get: async (id) => {
    return buildSchema()
      .connect()
      .then((db) => (typeof id === "undefined" ? index(db) : select(id, db)))
      .then((res) => (res.length === 1 ? res[0] : res))
  },
  post: async (obj) => {
    return buildSchema()
      .connect()
      .then((db) => insert(Task._serialize(obj), db))
      .then((db) => index(db))
  },
  patch: async (obj) => {
    return buildSchema()
      .connect()
      .then((db) => update(Task._serialize(obj), obj.taskId, db))
      .then((db) => index(db))
  }
}
