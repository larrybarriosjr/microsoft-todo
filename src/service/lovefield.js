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

const get = (id, db) => {
  const query = db.select().from(tblTasks).where(tblTasks.id.eq(id))
  return query.exec()
}

export const Task = {
  _serialize: (obj) => {
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
      .then((db) => insert(Task._createData(obj), db))
      .then((db) => index(db))
  }
}
