import { Task, Step } from "service/lovefield"

/**
 * Fetch Task API accepting the task ID and the setter function, usually setTask
 *
 * @param {number} id
 * @param {function} taskSetterFunction setState
 * @param {function} stepListSetterFunction setState
 * @return {object} Updated task item data
 *
 */
export const fetchTask = async (
  id,
  taskSetterFunction,
  stepListSetterFunction
) =>
  Promise.all([await Task.get(id), await Step.get(id)])
    .then(([taskRes, stepRes]) => {
      taskSetterFunction(taskRes[0])
      stepListSetterFunction(stepRes)
    })
    .catch((err) => console.log(err))

/**
 * Fetch Nav List API for getting the list of nav items.
 *
 * @param {Array} list taskList
 * @return {Array} Nav list items
 */
export const fetchNavList = (list) => [
  {
    key: "myDay",
    name: "My Day",
    icon: "icon-sun",
    amount: list.filter((item) => item.myDay).length
  },
  {
    key: "important",
    name: "Important",
    icon: "icon-star",
    amount: list.filter((item) => item.starred).length
  }
]

/**
 * Regular debounce function with 500ms default delay
 *
 * @param {function} func
 * @param {number} delay millisecond
 * @return {function} Debounced function
 */
export const debounce = (func, delay = 500) => {
  let timeout
  return function () {
    const ctx = this
    const args = arguments

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(ctx, args)
    }, delay)
  }
}
