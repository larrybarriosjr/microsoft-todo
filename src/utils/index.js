import dayjs from "dayjs"

// Day JS supplemental variables
export const currentHour = dayjs().startOf("hour")
export const currentDay = dayjs().startOf("day")

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
