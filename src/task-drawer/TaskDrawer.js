import React, { useState, useEffect, useCallback } from "react"
import { useSetRecoilState, useRecoilValue } from "recoil"
import { taskHiddenState, taskListState, taskState } from "state/atoms"
import { Task } from "service/lovefield"
import scss from "task-drawer/TaskDrawer.module.scss"
import { debounce } from "utils"
import TaskHeader from "task-drawer/TaskHeader"
import TaskReminder from "task-drawer/TaskReminder"
import TaskDueDate from "task-drawer/TaskDueDate"
import TaskMyDay from "task-drawer/TaskMyDay"
import TaskFooter from "task-drawer/TaskFooter"

const TaskDrawer = () => {
  // CRUD for Tasks
  const patchNotes = (id, notes) =>
    Task.patch({ id, notes })
      .then((res) => setTaskList(res))
      .catch((err) => console.log(err))

  const taskHidden = useRecoilValue(taskHiddenState)
  const task = useRecoilValue(taskState)
  const setTaskList = useSetRecoilState(taskListState)

  const [taskId, setTaskId] = useState("")
  const [taskNotes, setTaskNotes] = useState("")

  // Initialize task item inputs
  useEffect(() => {
    setTaskId(task.id)
    setTaskNotes(task.notes)
  }, [task])

  const patchNotesDebounced = useCallback(
    debounce((id, notes) => patchNotes(id, notes)),
    []
  )

  const handleChangeNotes = (e) => setTaskNotes(e.target.value)

  useEffect(() => {
    if (taskId) patchNotesDebounced(taskId, taskNotes)
  }, [taskId, taskNotes, patchNotesDebounced, setTaskList])

  return (
    <aside className={scss.container} hidden={taskHidden}>
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
        <form>
          <textarea
            rows="5"
            name="task-notes"
            placeholder="Add note"
            onChange={handleChangeNotes}
            value={taskNotes || ""}
          />
        </form>
      </section>

      {/* Footer with Close Drawer and Delete Task */}
      <TaskFooter />
    </aside>
  )
}

export default TaskDrawer
