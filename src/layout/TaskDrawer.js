import React, { useState, useEffect, useCallback } from "react"
import { useSetRecoilState, useRecoilState } from "recoil"
import {
  taskHiddenState,
  taskListState,
  taskState,
  reminderModalState,
  reminderCalendarModalState,
  dateState,
  hourState,
  minuteState,
  periodState
} from "state/atoms"
import { Task } from "service/lovefield"
import dayjs from "dayjs"
import scss from "layout/TaskDrawer.module.scss"
import DateCalendar from "common/DateCalendar"
import TaskHeader from "./TaskHeader"
import { debounce, currentDay, currentHour } from "utils"

const TaskDrawer = () => {
  // CRUD for Tasks
  const fetchTask = () =>
    Task.get(task.id)
      .then((res) => setTask(res))
      .catch((err) => console.log(err))

  const patchName = (id, name) =>
    Task.patch({ taskId: id, taskName: name })
      .then((res) => setTaskList(res))
      .catch((err) => console.log(err))

  const patchNotes = (id, notes) =>
    Task.patch({ taskId: id, taskNotes: notes })
      .then((res) => setTaskList(res))
      .catch((err) => console.log(err))

  const resetDate = () => {
    setDate(currentDay)
    setHour(dayjs().format("hh"))
    setMinute(dayjs().format("mm"))
    setPeriod(dayjs().format("A"))
  }

  const getInputHeight = (chars) => Math.ceil(chars / 22) * 1.75
  
  const getTimeDifference = (dt) => {
    if (dayjs().isSame(dt, "day")) return "(Today)"
    if (dayjs().add(1, "day").isSame(dt, "day")) return "(Tomorrow)"
    return `(${dayjs(dt).format("ddd, MMM D")})`
  }
  const getTaskReminder = (dt) =>
    dayjs(dt).format("h:mm A ") + getTimeDifference(dt)

  const [taskHidden, setTaskHidden] = useRecoilState(taskHiddenState)
  const [task, setTask] = useRecoilState(taskState)
  const [reminderModal, setReminderModal] = useRecoilState(reminderModalState)
  const [reminderCalendarModal, setReminderCalendarModal] = useRecoilState(
    reminderCalendarModalState
  )
  const [date, setDate] = useRecoilState(dateState)
  const [hour, setHour] = useRecoilState(hourState)
  const [minute, setMinute] = useRecoilState(minuteState)
  const [period, setPeriod] = useRecoilState(periodState)
  const setTaskList = useSetRecoilState(taskListState)

  const [taskId, setTaskId] = useState("")
  const [taskName, setTaskName] = useState("")
  const [taskNotes, setTaskNotes] = useState("")
  const [height, setHeight] = useState("1.75rem")

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

  const handleChangeName = (e) => {
    const inputLength = getInputHeight(e.target.value.length)
    setTaskName(e.target.value)
    setHeight((inputLength || 1.75) + "rem")
  }
  const handleChangeNotes = (e) => setTaskNotes(e.target.value)

  const handleMyDay = () => {
    if (!task.myDay) {
      Task.patch({ taskId, taskMyDay: true })
        .then((res) => setTaskList(res))
        .then(() => task.id === taskId && fetchTask())
        .catch((err) => console.log(err))
    }
  }
  const handleRemoveMyDay = () => {
    Task.patch({ taskId, taskMyDay: false })
      .then((res) => setTaskList(res))
      .then(() => task.id === taskId && fetchTask())
      .catch((err) => console.log(err))
  }

  const handleReminder = (e) => {
    e.stopPropagation()
    if (Notification.permission !== "granted") Notification.requestPermission()
    setReminderModal(true)
  }
  const handleRemoveReminder = () => {
    Task.patch({ taskId, taskReminder: null })
      .then((res) => setTaskList(res))
      .then(() => task.id === taskId && fetchTask())
      .catch((err) => console.log(err))
  }
  const handleReminderCalendar = () => {
    let dt = dayjs(task.reminder)
    setReminderCalendarModal(true)
    setDate(dt.startOf("day"))
    setMinute(dt.startOf("minute").format("mm"))
    if (dt.get("hour") > 12) {
      setHour(dt.startOf("hour").subtract(12, "hour").format("hh"))
      setPeriod("PM")
    } else {
      setHour(dt.startOf("hour").format("hh"))
      setPeriod("AM")
    }
  }

  const handleSubmitReminder = (preset) => async () => {
    let dt

    if (preset === "later") dt = currentHour.add(3, "h")
    if (preset === "tomorrow") dt = currentDay.add(1, "d").add(9, "h")
    if (preset === "next week") dt = currentDay.add(7, "d").add(9, "h")

    if (typeof preset === "undefined") {
      let hr = Number(hour)
      if (period === "PM") hr += 12
      dt = dayjs(date).add(hr, "h").add(minute, "m")
    }

    Task.patch({ taskId, taskReminder: new Date(dt) })
      .then((res) => setTaskList(res))
      .then(() => task.id === taskId && fetchTask())
      .then(() => setReminderCalendarModal(false))
      .then(resetDate())
      .catch((err) => console.log(err))
  }

  const handleCancelReminder = () => {
    setReminderCalendarModal(false)
    resetDate()
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

  // Initialize task item inputs
  useEffect(() => {
    if (taskId && taskName) {
      patchNameDebounced(taskId, taskName)
    }
  }, [taskId, taskName, patchNameDebounced, setTaskList])

  useEffect(() => {
    if (taskId) {
      patchNotesDebounced(taskId, taskNotes)
      }
  }, [taskId, taskNotes, patchNotesDebounced, setTaskList])

  const actionMyDayClass = task.myDay && scss["action-myday-checked"]
  const actionDateClass = (date) => {
    if (dayjs().isAfter(date)) return scss["action-date-error"]
    if (date) return scss["action-date-checked"]
  }

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
        <form className={actionDateClass(task.reminder)}>
          <i className="icon-bell" onClick={handleReminder} />
          <p onClick={handleReminder}>
            {task.reminder
              ? `Remind me at ${getTaskReminder(task.reminder)}`
              : "Remind me"}
          </p>
          {task.reminder && (
            <button type="button" onClick={handleRemoveReminder}>
              <i className="icon-cancel" />
            </button>
          )}
          <dialog className={scss["reminder-modal"]} open={reminderModal}>
            <button type="button" onClick={handleSubmitReminder("later")}>
              <i className="icon-hourglass" />
              <p>Later Today</p>
              <span>{currentHour.add(3, "hour").format("h:mm A")}</span>
            </button>
            <button type="button" onClick={handleSubmitReminder("tomorrow")}>
              <i className="icon-right" />
              <p>Tomorrow</p>
              <span>
                {currentDay.add(1, "d").add(9, "h").format("ddd, h:mm A")}
              </span>
            </button>
            <button type="button" onClick={handleSubmitReminder("next week")}>
              <i className="icon-fast-fw" />
              <p>Next Week</p>
              <span>
                {currentDay.add(7, "d").add(9, "h").format("ddd, h:mm A")}
              </span>
            </button>
            <footer>
              <button type="button" onClick={handleReminderCalendar}>
                <i className="icon-wristwatch" />
                <p>Pick a date and time</p>
              </button>
            </footer>
          </dialog>
          <DateCalendar
            time
            open={reminderCalendarModal}
            onCancel={handleCancelReminder}
            onSubmit={handleSubmitReminder()}
          />
        </form>
        <form>
          <i className="icon-calendar-plus-o" />
          <p>Add due date</p>
          <button type="button">
            <i className="icon-cancel" />
          </button>
        </form>
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
