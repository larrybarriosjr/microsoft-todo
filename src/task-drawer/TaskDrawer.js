import React from "react"
import { useRecoilValue } from "recoil"
import { taskHiddenState, taskState } from "state/atoms"
import scss from "task-drawer/TaskDrawer.module.scss"
import TaskHeader from "task-drawer/TaskHeader"
import TaskReminder from "task-drawer/TaskReminder"
import TaskDueDate from "task-drawer/TaskDueDate"
import TaskMyDay from "task-drawer/TaskMyDay"
import TaskFooter from "task-drawer/TaskFooter"
import TaskNotes from "./TaskNotes"

const TaskDrawer = () => {
  const taskHidden = useRecoilValue(taskHiddenState)
  const task = useRecoilValue(taskState)

  return (
    !taskHidden &&
    task && (
      <aside className={scss.container} hidden={taskHidden}>
        <div className={scss.content}>
          {/* Header with Task Name, Completed, Starred and Steps Input */}
          <TaskHeader />

          <section>
            {/* Add to My Day */}
            <TaskMyDay />

            {/* Remind Me */}
            <TaskReminder />

            {/* Add Due Date */}
            <TaskDueDate />
          </section>

          <section>
            {/* Add Note */}
            <TaskNotes />
          </section>
        </div>

        {/* Footer with Close Drawer and Delete Task */}
        <TaskFooter />
      </aside>
    )
  )
}

export default TaskDrawer
