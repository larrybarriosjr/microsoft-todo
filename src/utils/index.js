import dayjs from "dayjs"
import { Task } from "service/lovefield"

// Day JS supplemental variables (not formatted)
export const currentHour = dayjs().startOf("hour")
export const currentDay = dayjs().startOf("day")

/**
 * Fetch Task API accepting the task ID and the setter function, usually setTask
 *
 * @param {number} id
 * @param {function} setterFunction setState
 * @return {object} Updated task item data
 *
 */
export const fetchTask = (id, setterFunction) =>
  Task.get(id)
    .then((res) => setterFunction(res))
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
