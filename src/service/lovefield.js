import lf from "lovefield"
import { v4 as uuid } from "uuid"

const dt = () => new Date()

const buildSchema = () => {
  const schemaBuilder = lf.schema.create("ms-todo", 1)

  schemaBuilder
    .createTable("tasks")

    .addColumn("id", lf.Type.STRING)
    .addColumn("name", lf.Type.STRING)
    .addColumn("myDay", lf.Type.BOOLEAN)
    .addColumn("completed", lf.Type.BOOLEAN)
    .addColumn("starred", lf.Type.BOOLEAN)
    .addColumn("steps", lf.Type.ARRAY_BUFFER)
    .addColumn("dueDate", lf.Type.DATE_TIME)
    .addColumn("reminder", lf.Type.DATE_TIME)
    .addColumn("notes", lf.Type.STRING)

    .addColumn("dateCreated", lf.Type.DATE_TIME)
    .addColumn("_myDay", lf.Type.DATE_TIME)
    .addColumn("_completed", lf.Type.DATE_TIME)
    .addColumn("_starred", lf.Type.DATE_TIME)
    .addColumn("_dueDate", lf.Type.DATE_TIME)

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

const remove = (id, db) => {
  db.delete().from(tblTasks).where(tblTasks.id.eq(id)).exec()
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
      steps,
      dueDate,
      reminder,
      notes
    } = obj

    if (id) {
      if ("name" in obj) return { name: name }
      if ("myDay" in obj) return { myDay: myDay, _myDay: dt() }
      if ("completed" in obj) return { completed: completed, _completed: dt() }
      if ("starred" in obj) return { starred: starred, _starred: dt() }
      if ("steps" in obj) return { steps: steps }
      if ("dueDate" in obj) return { dueDate: dueDate, _dueDate: dt() }
      if ("reminder" in obj) return { reminder: reminder }
      if ("notes" in obj) return { notes: notes }
    }
    return {
      id: uuid(),
      name: name,
      myDay: true,
      completed: false,
      starred: false,
      steps: null,
      notes: "",
      dateCreated: dt(),
      listId: null,
      _myDay: dt(),
      _completed: dt(),
      _starred: dt(),
      _dueDate: dt()
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
      .then((db) => update(Task._serialize(obj), obj.id, db))
      .then((db) => index(db))
  },
  delete: async (id) => {
    return buildSchema()
      .connect()
      .then((db) => remove(id, db))
      .then((db) => index(db))
  }
}
