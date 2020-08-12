import React from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import {
  taskState,
  taskListState,
  reminderModalState,
  reminderCalendarModalState,
  dueDateModalState,
  dueDateCalendarModalState,
  dateState,
  hourState,
  minuteState,
  periodState
} from "state/atoms"
import DateCalendar from "common/DateCalendar"
import { fetchTask } from "utils"
import { Task } from "service/lovefield"
import scss from "task-drawer/TaskReminder.module.scss"
import dayjs from "dayjs"

const TaskReminder = () => {
  const setTaskList = useSetRecoilState(taskListState)
  const setDueDateModal = useSetRecoilState(dueDateModalState)
  const setDueDateCalendarModal = useSetRecoilState(dueDateCalendarModalState)

  const [date, setDate] = useRecoilState(dateState)
  const [hour, setHour] = useRecoilState(hourState)
  const [minute, setMinute] = useRecoilState(minuteState)
  const [period, setPeriod] = useRecoilState(periodState)

  const [task, setTask] = useRecoilState(taskState)
  const [reminderModal, setReminderModal] = useRecoilState(reminderModalState)
  const [reminderCalendarModal, setReminderCalendarModal] = useRecoilState(
    reminderCalendarModalState
  )

  /**
   * Set calendar states to specified date.
   * Set to now if date is undefined.
   *
   * @param {Date|String|dayjs} date
   */
  const setCalendarStates = (date) => {
    // Set dt to today if date is undefined
    const dt = date ? dayjs(date) : dayjs()

    setDate(dt.startOf("day")) // Set date
    setMinute(dt.format("mm")) // Set minute
    setHour(dt.format("hh")) // Set hour
    setPeriod(dt.format("A")) // Set AM/PM period
  }

  // Remove reminder in task item on button press
  const handleRemoveReminder = () => {
    Task.patch({ id: task.id, reminder: null })
      .then((res) => setTaskList(res))
      .then(() => fetchTask(task.id, setTask))
      .catch((err) => console.log(err))
  }

  // Open Remind Me modal and close Due Date modals
  const handleReminder = (e) => {
    e.stopPropagation() // Disable closing of this modal
    setReminderModal(true)
    setDueDateModal(false)
    setDueDateCalendarModal(false)
  }

  // Open Reminder Calendar modal
  const handleReminderCalendar = () => {
    setReminderCalendarModal(true) // Display reminder calendar modal
    setCalendarStates(task.reminder) // Set date, hour, minute, period according to task.reminder
  }

  // Preset date variables
  const later = dayjs().startOf("hour").add(3, "h")
  const tomorrow = dayjs().startOf("day").add(1, "d").add(9, "h")
  const nextWeek = dayjs().startOf("day").add(7, "d").add(9, "h")

  // Submit reminder and immediately update task list and task item details
  const handleSubmitReminder = (preset) => () => {
    let dt

    // Check preset value
    if (preset === "later") dt = later
    if (preset === "tomorrow") dt = tomorrow
    if (preset === "next week") dt = nextWeek

    // If preset is undefined, set dt to calendar values
    if (typeof preset === "undefined") {
      let hr = Number(hour)
      if (period === "PM") hr += 12 // Add 12 to hour for PM period
      if (hr % 12 === 0) hr -= 12 // Revert the previously added 12 if hour is 12PM
      dt = dayjs(date).add(hr, "h").add(minute, "m")
    }

    // Don't forget ASYNC for AWAIT
    // const registration = await navigator.serviceWorker.getRegistration()
    // const options = {
    //   tag: dt.valueOf(),
    //   body: "Sample Task",
    //   showTrigger: new window.TimestampTrigger(dt.valueOf())
    // }

    Task.patch({ id: task.id, reminder: new Date(dt) })
      .then((res) => setTaskList(res))
      .then(() => fetchTask(task.id, setTask))
      .then(setReminderCalendarModal(false)) // Close reminder calendar modal
      // .then(() => registration.showNotification("Task Reminder", options)) // Set PWA Notification
      .then(setCalendarStates()) // Reset calendar values to now
      .catch((err) => console.log(err))
  }

  // Cancel reminder submission and reset calendar values
  const handleCancelReminder = () => {
    setReminderCalendarModal(false)
    setCalendarStates()
  }

  // Style: Toggle primary and error color for ongoing and expired reminder
  const actionDateClass = () => {
    if (dayjs().isAfter(task.reminder)) return scss["action-date-error"]
    if (task.reminder) return scss["action-date-checked"]
  }

  // Render Remind Me phrase with date and time if task has reminder
  const ReminderDate = () => {
    const timeDiff = (dt) => {
      if (dayjs().isSame(dt, "day")) return "(Today)"
      if (dayjs().add(1, "day").isSame(dt, "day")) return "(Tomorrow)"
      return `(${dayjs(dt).format("ddd, MMM D")})`
    }
    return (
      "Remind me at " +
      dayjs(task.reminder).format("h:mm A ") +
      timeDiff(task.reminder)
    )
  }

  return (
    <form className={actionDateClass()}>
      <i className="icon-bell" onClick={handleReminder} />
      <p onClick={handleReminder}>
        {task.reminder ? <ReminderDate /> : "Remind me"}
      </p>
      {task.reminder && (
        <button type="button" onClick={handleRemoveReminder}>
          <i className="icon-cancel" />
        </button>
      )}
      <dialog className={scss["reminder-modal"]} open={reminderModal}>
        {later.isBefore(dayjs().endOf("day")) && (
          <button type="button" onClick={handleSubmitReminder("later")}>
            <i className="icon-hourglass" />
            <p>Later Today</p>
            <span>{later.format("h:mm A")}</span>
          </button>
        )}
        <button type="button" onClick={handleSubmitReminder("tomorrow")}>
          <i className="icon-right" />
          <p>Tomorrow</p>
          <span>{tomorrow.format("ddd, h:mm A")}</span>
        </button>
        <button type="button" onClick={handleSubmitReminder("next week")}>
          <i className="icon-fast-fw" />
          <p>Next Week</p>
          <span>{nextWeek.format("ddd, h:mm A")}</span>
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
  )
}

export default TaskReminder
