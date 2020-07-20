import { atom } from "recoil"

export const pageState = atom({
  key: "pageState",
  default: "myDay"
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
