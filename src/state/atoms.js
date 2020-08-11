import { atom } from "recoil"
import dayjs from "dayjs"

/** Current page name. */
export const pageState = atom({
  key: "pageState",
  default: "myDay"
})

/** Reminder modal with preset actions. */
export const reminderModalState = atom({
  key: "reminderModalState",
  default: false
})

/** Calendar modal for the reminder. */
export const reminderCalendarModalState = atom({
  key: "reminderCalendarModalState",
  default: false
})

/** Current date chosen in calendar modals. */
export const dateState = atom({
  key: "dateState",
  default: dayjs().startOf("day")
})

/** Current hour chosen in time picker. */
export const hourState = atom({
  key: "hourState",
  default: dayjs().format("hh")
})

/** Current minute chosen in time picker. */
export const minuteState = atom({
  key: "minuteState",
  default: dayjs().format("mm")
})

/** Current period chosen in time picker. */
export const periodState = atom({
  key: "periodState",
  default: dayjs().format("A")
})

/** Task drawer display. */
export const taskHiddenState = atom({
  key: "taskHiddenState",
  default: true
})

/** List of all task items (unfiltered). */
export const taskListState = atom({
  key: "taskList",
  default: []
})

/** Data of the current task item chosen. */
export const taskState = atom({
  key: "taskState",
  default: {}
})
