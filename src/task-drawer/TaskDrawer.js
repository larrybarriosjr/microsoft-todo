import React, { useState, useEffect, useCallback, useRef } from "react"
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
  const patchName = (id, name) =>
    Task.patch({ id, name })
      .then((res) => setTaskList(res))
      .catch((err) => console.log(err))

  const patchNotes = (id, notes) =>
    Task.patch({ id, notes })
      .then((res) => setTaskList(res))
      .catch((err) => console.log(err))

  const taskHidden = useRecoilValue(taskHiddenState)
  const task = useRecoilValue(taskState)
  const setTaskList = useSetRecoilState(taskListState)

  const [taskId, setTaskId] = useState("")
  const [taskName, setTaskName] = useState("")
  const [taskNotes, setTaskNotes] = useState("")

  // Initialize task item inputs
  useEffect(() => {
    setTaskId(task.id)
    setTaskName(task.name)
    setTaskNotes(task.notes)
  }, [task])

  const patchNameDebounced = useCallback(
    debounce((id, name) => patchName(id, name)),
    []
  )
  const patchNotesDebounced = useCallback(
    debounce((id, notes) => patchNotes(id, notes)),
    []
  )

  const taskNameRef = useRef(null)

  const handleChangeName = (e) => setTaskName(e.target.value)
  const handleChangeNotes = (e) => setTaskNotes(e.target.value)

  // Automatically submit on task name change
  useEffect(() => {
    const input = taskNameRef.current
    if (taskId && taskName) {
      input.style.height = "1.5rem"
      input.style.height = `${input.scrollHeight}px`
      patchNameDebounced(taskId, taskName)
    }
  }, [taskId, taskName, patchNameDebounced, setTaskList])

  useEffect(() => {
    if (taskId) {
      patchNotesDebounced(taskId, taskNotes)
    }
  }, [taskId, taskNotes, patchNotesDebounced, setTaskList])

  return (
    <aside className={scss.container} hidden={taskHidden}>
      <TaskHeader
        id={task.id}
        name={taskName}
        completed={task.completed}
        starred={task.starred}
        onChange={handleChangeName}
        ref={taskNameRef}
      />
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
