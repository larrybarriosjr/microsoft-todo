import { atom } from "recoil"

export const pageState = atom({
  key: "pageState",
  default: "myDay"
})

export const myDayListState = atom({
  key: "myDayListState",
  default: [
    {
      name: "Sample",
      description: "Sample Task",
      starred: false,
      completed: false
    }
  ]
})
