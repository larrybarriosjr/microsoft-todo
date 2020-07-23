import { selector } from "recoil"
import { pageState, taskListState } from "state/atoms"

export const pageListState = selector({
  key: "pageListState",
  get: ({ get }) => {
    const page = get(pageState)
    const taskList = get(taskListState)
    switch (page) {
      case "myDay":
        return taskList.filter((task) => task.myDay)
      default:
        return taskList.filter((task) => task.listId === null)
    }
  }
})
