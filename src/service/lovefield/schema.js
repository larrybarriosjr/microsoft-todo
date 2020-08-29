import lf from "lovefield"

export const buildSchema = () => {
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
    .addColumn("order", lf.Type.NUMBER)
    .addPrimaryKey(["id"])

  return schemaBuilder
}
