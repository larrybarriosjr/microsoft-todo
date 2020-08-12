import { selector } from "recoil"
import { pageState, taskListState } from "state/atoms"

/** List of task items depending on current page. */
export const pageListState = selector({
  key: "pageListState",
  get: ({ get }) => {
    const page = get(pageState) // get page name
    const taskList = get(taskListState) // get all task items (unfiltered)
    if (taskList.length) {
      switch (page) {
        // return all task items with My Day only
        case "myDay":
          return taskList
            .filter((task) => task.myDay)
            .sort((a, b) => a._myDay - b._myDay) // ascending, new item at the end

        // return all task items not belonging to a list
        default:
          return taskList.filter((task) => task.listId === null)
      }
    } else {
      return [] // empty task list
    }
  }
})
