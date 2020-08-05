import dayjs from "dayjs"
import { Task } from "service/lovefield"

// Day JS supplemental variables
export const currentHour = dayjs().startOf("hour")
export const currentDay = dayjs().startOf("day")

// Fetch Task API
export const fetchTask = (id, setter) =>
  Task.get(id)
    .then((res) => setter(res))
    .catch((err) => console.log(err))

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
