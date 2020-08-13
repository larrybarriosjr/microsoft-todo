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
      taskSetterFunction(taskRes)
      stepListSetterFunction(stepRes)
    })
    .catch((err) => console.log(err))

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
