import { selector } from "recoil"
import { pageState, taskListState, stepListState, taskState } from "state/atoms"

/** List of task items depending on current page. */
export const pageListState = selector({
  key: "pageListState",
  get: ({ get }) => {
    const page = get(pageState) // get page name
    const taskList = get(taskListState) // get all task items (unfiltered)
    if (taskList.length) {
      switch (page) {
        // return all task items with My Day only
        case "My Day":
          return taskList
            .filter((task) => task.myDay && !task.completed)
            .sort((a, b) => a.myDayEdited - b.myDayEdited) // ascending, new item at the end

        // return all task items with Starred only
        case "Important":
          return taskList
            .filter((task) => task.starred && !task.completed)
            .sort((a, b) => a.starredEdited - b.starredEdited) // ascending, new item at the end

        // return all task items with Due Date only
        case "Planned":
          return taskList
            .filter((task) => task.dueDate && !task.completed)
            .sort((a, b) => a.dueDate - b.dueDate) // ascending, new item at the end

        // return all task items not belonging to a list
        default:
          return taskList.filter(
            (task) => task.listId === null && !task.completed
          )
      }
    } else {
      return [] // empty task list
    }
  }
})

export const completedListState = selector({
  key: "completedListState",
  get: ({ get }) => {
    const page = get(pageState) // get page name
    const taskList = get(taskListState) // get all task items (unfiltered)
    if (taskList.length) {
      switch (page) {
        // return all task items with My Day only
        case "My Day":
          return taskList
            .filter((task) => task.myDay && task.completed)
            .sort((a, b) => a.completedEdited - b.completedEdited) // ascending, new item at the end

        case "Important":
        case "Planned":
          return []

        // return all task items not belonging to a list
        default:
          return taskList
            .filter((task) => task.listId === null && task.completed)
            .sort((a, b) => a.completedEdited - b.completedEdited) // ascending, new item at the end
      }
    } else {
      return [] // empty task list
    }
  }
})

export const taskStepsState = selector({
  key: "taskStepsState",
  get: ({ get }) => {
    const task = get(taskState)
    const stepList = get(stepListState)
    if (stepList.length) {
      return stepList.filter((step) => task.id === step.taskId)
    } else {
      return []
    }
  }
})
