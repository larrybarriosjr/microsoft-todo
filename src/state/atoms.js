import { atom } from "recoil"
import dayjs from "dayjs"

/** Current page name. */
export const pageState = atom({
  key: "pageState",
  default: "My Day"
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

/** Due date modal with preset actions. */
export const dueDateModalState = atom({
  key: "dueDateModalState",
  default: false
})

/** Calendar modal for the due date. */
export const dueDateCalendarModalState = atom({
  key: "dueDateCalendarModalState",
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
export const taskItemsState = atom({
  key: "taskItemsState",
  default: []
})

/** Data of the current task item chosen. */
export const taskState = atom({
  key: "taskState",
  default: {}
})

/** List of all step items (unfiltered). */
export const stepItemsState = atom({
  key: "stepItemsState",
  default: []
})

/** Data of the current step item chosen. */
export const stepState = atom({
  key: "stepState",
  default: {}
})

export const stepModalState = atom({
  key: "stepModalState",
  default: false
})

export const themeModalState = atom({
  key: "themeModalState",
  default: false
})

export const taskListsState = atom({
  key: "taskListsState",
  default: []
})

export const listState = atom({
  key: "listState",
  default: {}
})

export const listModalState = atom({
  key: "listModalState",
  default: false
})

// 4, 1, 30, 29, 22, 21, 16, 15, 14, 13, 12, 11, 5, 3, 28, 26, 24, 23, 21, 20, 14, 13, 10, 9, 8
// 25 days
