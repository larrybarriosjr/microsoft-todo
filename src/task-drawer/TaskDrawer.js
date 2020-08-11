import React, { useState, useEffect, useCallback, useRef } from "react"
import { useSetRecoilState, useRecoilState } from "recoil"
import { taskHiddenState, taskListState, taskState } from "state/atoms"
import { Task } from "service/lovefield"
import dayjs from "dayjs"
import scss from "task-drawer/TaskDrawer.module.scss"
import TaskHeader from "task-drawer/TaskHeader"
import { fetchTask, debounce } from "utils"
import TaskReminder from "./TaskReminder"

const TaskDrawer = () => {
  // CRUD for Tasks
  const patchName = (id, name) =>
    Task.patch({ taskId: id, taskName: name })
      .then((res) => setTaskList(res))
      .catch((err) => console.log(err))

  const patchNotes = (id, notes) =>
    Task.patch({ taskId: id, taskNotes: notes })
      .then((res) => setTaskList(res))
      .catch((err) => console.log(err))

  const [taskHidden, setTaskHidden] = useRecoilState(taskHiddenState)
  const [task, setTask] = useRecoilState(taskState)
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

  const handleChangeName = (e) => {
    setTaskName(e.target.value)
  }
  const handleChangeNotes = (e) => setTaskNotes(e.target.value)

  const handleMyDay = () => {
    if (!task.myDay) {
      Task.patch({ taskId, taskMyDay: true })
        .then((res) => setTaskList(res))
        .then(() => task.id === taskId && fetchTask(task.id, setTask))
        .catch((err) => console.log(err))
    }
  }
  const handleRemoveMyDay = () => {
    Task.patch({ taskId, taskMyDay: false })
      .then((res) => setTaskList(res))
      .then(() => task.id === taskId && fetchTask(task.id, setTask))
      .catch((err) => console.log(err))
  }

  const handleCloseDrawer = () => {
    setTask({})
    setTaskHidden(true)
  }

  const handleDeleteTask = () => {
    Task.delete(taskId)
      .then((res) => setTaskList(res))
      .then(handleCloseDrawer)
      .catch((err) => console.log(err))
  }

  const dateCreated = dayjs(task.dateCreated).format("ddd, MMMM D")

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

  const actionMyDayClass = task.myDay && scss["action-myday-checked"]

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
        <form className={actionMyDayClass}>
          <i className="icon-sun" onClick={handleMyDay} />
          <p onClick={handleMyDay}>
            {task.myDay ? "Added to My Day" : "Add to My Day"}
          </p>
          {task.myDay && (
            <button type="button" onClick={handleRemoveMyDay}>
              <i className="icon-cancel" />
            </button>
          )}
        </form>

        {/* Remind Me */}
        <TaskReminder />

        {/* Add Due Date */}
        {/* <form className={actionDateClass(task.dueDate)}>
          <i className="icon-calendar-plus-o" />
          <p onClick={handleReminder}>
            {task.dueDate
              ? `Due ${getTaskReminder(task.dueDate)}`
              : "Add Due Date"}
          </p>
          {task.dueDate && (
            <button type="button" onClick={handleRemoveReminder}>
              <i className="icon-cancel" />
            </button>
          )}
          <dialog className={scss["reminder-modal"]} open={reminderModal}>
            <button type="button" onClick={handleSubmitReminder("later")}>
              <i className="icon-hourglass" />
              <p>Today</p>
              <span>{currentDay.format("ddd")}</span>
            </button>
            <button type="button" onClick={handleSubmitReminder("tomorrow")}>
              <i className="icon-right" />
              <p>Tomorrow</p>
              <span>{currentDay.add(1, "d").add(9, "h").format("ddd")}</span>
            </button>
            <button type="button" onClick={handleSubmitReminder("next week")}>
              <i className="icon-fast-fw" />
              <p>Next Week</p>
              <span>{currentDay.add(7, "d").add(9, "h").format("ddd")}</span>
            </button>
            <footer>
              <button type="button" onClick={handleReminderCalendar}>
                <i className="icon-calendar-plus-o" />
                <p>Pick a date</p>
              </button>
            </footer>
          </dialog>
          <DateCalendar
            open={reminderCalendarModal}
            onCancel={handleCancelReminder}
            onSubmit={handleSubmitReminder()}
          />
        </form> */}
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
      <footer className={scss.footer}>
        <form>
          <button type="button" onClick={handleCloseDrawer}>
            <i className="icon-right-open" />
          </button>
          <p>Created on {dateCreated}</p>
          <button type="button" onClick={handleDeleteTask}>
            <i className="icon-trash" />
          </button>
        </form>
      </footer>
    </aside>
  )
}

export default TaskDrawer
