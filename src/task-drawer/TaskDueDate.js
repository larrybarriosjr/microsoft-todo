import React from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import {
  taskState,
  taskItemsState,
  reminderModalState,
  reminderCalendarModalState,
  dueDateModalState,
  dueDateCalendarModalState,
  dateState,
  stepItemsState
} from "state/atoms"
import DateCalendar from "common/DateCalendar"
import { fetchTask } from "utils"
import { Task } from "service/lovefield"
import scss from "task-drawer/TaskDueDate.module.scss"
import dayjs from "dayjs"

const TaskDueDate = () => {
  const setTaskItems = useSetRecoilState(taskItemsState)
  const setStepItems = useSetRecoilState(stepItemsState)
  const setReminderModal = useSetRecoilState(reminderModalState)
  const setReminderCalendarModal = useSetRecoilState(reminderCalendarModalState)

  const [date, setDate] = useRecoilState(dateState)

  const [task, setTask] = useRecoilState(taskState)
  const [dueDateModal, setDueDateModal] = useRecoilState(dueDateModalState)
  const [dueDateCalendarModal, setDueDateCalendarModal] = useRecoilState(
    dueDateCalendarModalState
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
  }

  // Remove due date in task item on button press
  const handleRemoveDueDate = () => {
    Task.patch({ id: task.id, dueDate: null })
      .then((res) => setTaskItems(res))
      .then(() => fetchTask(task.id, setTask, setStepItems))
      .catch((err) => console.log(err))
  }

  // Open Due Date modal and close Remind Me modals
  const handleDueDate = (e) => {
    e.stopPropagation() // Disable closing of this modal
    setDueDateModal(true)
    setReminderModal(false)
    setReminderCalendarModal(false)
  }

  // Open Due Date Calendar modal
  const handleDueDateCalendar = () => {
    setDueDateCalendarModal(true) // Display due date calendar modal
    setCalendarStates(task.dueDate) // Set date according to task.dueDate
  }

  // Preset date variables
  const today = dayjs().startOf("day")
  const tomorrow = today.add(1, "d")
  const nextWeek = today.add(7, "d")

  // Submit due date and immediately update task list and task item details
  const handleSubmitDueDate = (preset) => () => {
    let dt

    // Check preset value
    if (preset === "today") dt = today
    if (preset === "tomorrow") dt = tomorrow
    if (preset === "next week") dt = nextWeek

    // If preset is undefined, set dt to calendar values
    if (typeof preset === "undefined") {
      dt = dayjs(date).startOf("day")
    }

    // Don't forget ASYNC for AWAIT
    // const registration = await navigator.serviceWorker.getRegistration()
    // const options = {
    //   tag: dt.valueOf(),
    //   body: "Sample Task",
    //   showTrigger: new window.TimestampTrigger(dt.valueOf())
    // }

    Task.patch({ id: task.id, dueDate: new Date(dt) })
      .then((res) => setTaskItems(res))
      .then(() => fetchTask(task.id, setTask, setStepItems))
      .then(setDueDateCalendarModal(false)) // Close due date calendar modal
      // .then(() => registration.showNotification("Task Due Date", options)) // Set PWA Notification
      .then(setCalendarStates()) // Reset calendar values to now
      .catch((err) => console.log(err))
  }

  // Cancel due date submission and reset calendar values
  const handleCancelDueDate = () => {
    setDueDateCalendarModal(false)
    setCalendarStates()
  }

  // Style: Toggle primary and error color for ongoing and expired due date
  const actionDateClass = () => {
    if (dayjs().startOf("day").isAfter(task.dueDate))
      return scss["action-date-error"]
    if (task.dueDate) return scss["action-date-checked"]
  }

  // Render Due Date phrase with date and time if task has due date
  const DueDate = () => {
    const timeDiff = (dt) => {
      if (dayjs().isSame(dt, "day")) return "Today"
      if (dayjs().add(1, "day").isSame(dt, "day")) return "Tomorrow"
      return dayjs(dt).format("ddd, MMM D")
    }
    return "Due " + timeDiff(task.dueDate)
  }

  return (
    <form className={actionDateClass()}>
      <i className="icon-calendar-plus-o" onClick={handleDueDate} />
      <p onClick={handleDueDate}>
        {task.dueDate ? <DueDate /> : "Add due date"}
      </p>
      {task.dueDate && (
        <button type="button" onClick={handleRemoveDueDate}>
          <i className="icon-cancel" />
        </button>
      )}
      <dialog className={scss["due-date-modal"]} open={dueDateModal}>
        {today.isBefore(dayjs().endOf("day")) && (
          <button type="button" onClick={handleSubmitDueDate("today")}>
            <i className="icon-hourglass" />
            <p>Today</p>
            <span>{today.format("ddd")}</span>
          </button>
        )}
        <button type="button" onClick={handleSubmitDueDate("tomorrow")}>
          <i className="icon-right" />
          <p>Tomorrow</p>
          <span>{tomorrow.format("ddd")}</span>
        </button>
        <button type="button" onClick={handleSubmitDueDate("next week")}>
          <i className="icon-fast-fw" />
          <p>Next Week</p>
          <span>{nextWeek.format("ddd")}</span>
        </button>
        <footer>
          <button type="button" onClick={handleDueDateCalendar}>
            <i className="icon-calendar-check-o" />
            <p>Pick a date</p>
          </button>
        </footer>
      </dialog>
      <DateCalendar
        open={dueDateCalendarModal}
        onCancel={handleCancelDueDate}
        onSubmit={handleSubmitDueDate()}
      />
    </form>
  )
}

export default TaskDueDate
