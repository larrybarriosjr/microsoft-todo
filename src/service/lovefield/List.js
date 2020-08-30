import lf from "lovefield"
import { buildSchema, tblLists } from "service/lovefield/schema"
import { v4 as uuid } from "uuid"

const selectList = (id, db) => {
  const query = db.select().from(tblLists).where(tblLists.id.eq(id))
  return query.exec()
}

const indexList = (db) => {
  const query = db.select().from(tblLists).orderBy(tblLists.order)
  return query.exec()
}

const insertList = (data, db) => {
  const dataRow = tblLists.createRow(data)
  const result = db.insert().into(tblLists).values([dataRow]).exec()
  result.then((res) => (List._order = res[0].order + 1))

  return db
}

const updateList = (data, id, db) => {
  const dataKey = Object.keys(data)[0]

  db.update(tblLists)
    .set(tblLists[dataKey], data[dataKey])
    .where(tblLists.id.eq(id))
    .exec()

  return db
}

const removeList = async (id, db) => {
  db.delete().from(tblLists).where(tblLists.id.eq(id)).exec()
  return db
}

const getAdjacent = async (fromOrder, toOrder, db) => {
  if (fromOrder > toOrder) {
    const result = await db
      .select(tblLists.order)
      .from(tblLists)
      .where(tblLists.order.lt(toOrder))
      .orderBy(tblLists.order, lf.Order.DESC)
      .exec()
    if (result.length) return [db, result]
    return [db, [{ order: Math.floor(toOrder - 1) }]]
  } else {
    const result = await db
      .select(tblLists.order)
      .from(tblLists)
      .where(tblLists.order.gt(toOrder))
      .orderBy(tblLists.order)
      .exec()
    if (result.length) return [db, result]
    return [db, [{ order: Math.ceil(toOrder + 1) }]]
  }
}

const reorderList = (fromObj, toOrder, res, db) => {
  const order = (toOrder + res[0].order) / 2

  db.update(tblLists)
    .set(tblLists.order, order)
    .where(tblLists.id.eq(fromObj.id))
    .exec()

  return db
}

export const List = {
  _order: 0,
  _serialize: (obj) => {
    const { id, name, order } = obj
    if (id) {
      if ("name" in obj) return { name }
      if ("order" in obj) return { order }
    }
    return {
      id: uuid(),
      name: name,
      order: List._order
    }
  },
  get: async (id) => {
    return buildSchema()
      .connect()
      .then((db) =>
        typeof id === "undefined" ? indexList(db) : selectList(id, db)
      )
  },
  post: async (obj) => {
    return buildSchema()
      .connect()
      .then((db) => insertList(List._serialize(obj), db))
      .then((db) => indexList(db))
  },
  patch: async (obj) => {
    return buildSchema()
      .connect()
      .then((db) => updateList(List._serialize(obj), obj.id, db))
      .then((db) => indexList(db))
  },
  delete: async (id) => {
    return buildSchema()
      .connect()
      .then((db) => removeList(id, db))
      .then((db) => indexList(db))
  },
  reorder: async (fromObj, toOrder) => {
    return buildSchema()
      .connect()
      .then((db) => getAdjacent(fromObj.order, toOrder, db))
      .then(([db, res]) => reorderList(fromObj, toOrder, res, db))
      .then((db) => indexList(db))
  }
}
