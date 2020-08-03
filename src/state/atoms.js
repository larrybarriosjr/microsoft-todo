import { atom } from "recoil"
import dayjs from "dayjs"

export const pageState = atom({
  key: "pageState",
  default: "myDay"
})

export const reminderModalState = atom({
  key: "reminderModalState",
  default: false
})

export const reminderCalendarModalState = atom({
  key: "reminderCalendarModalState",
  default: false
})

export const dateState = atom({
  key: "dateState",
  default: dayjs().startOf("day")
})

export const hourState = atom({
  key: "hourState",
  default: dayjs().format("hh")
})

export const minuteState = atom({
  key: "minuteState",
  default: dayjs().format("mm")
})

export const periodState = atom({
  key: "periodState",
  default: dayjs().format("A")
})

export const taskHiddenState = atom({
  key: "taskHiddenState",
  default: true
})

export const taskListState = atom({
  key: "taskList",
  default: []
})

export const taskState = atom({
  key: "taskState",
  default: {}
})
