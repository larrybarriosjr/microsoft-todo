import React, { useState } from "react"
import scss from "common/DateCalendar.module.scss"
import dayjs from "dayjs"
import { useSetRecoilState, useRecoilValue } from "recoil"
import { dateState } from "state/atoms"
import TimePicker from "./TimePicker"

const DayCells = ({ currentMonth, onClick }) => {
  const selectedDate = useRecoilValue(dateState)

  const monthStart = dayjs(currentMonth).startOf("month").format()
  const monthEnd = dayjs(currentMonth).endOf("month").format()
  const startDate = dayjs(monthStart).startOf("week").format()
  const endDate = dayjs(monthEnd).endOf("week").format()

  const dayCellClasses = (day) => {
    let classes = []
    if (dayjs(day).isSame(dayjs(), "day")) classes.push(scss.today)
    if (dayjs(day).isSame(selectedDate, "day")) classes.push(scss.selected)
    if (!dayjs(day).isSame(monthStart, "month")) classes = [scss.disabled]
    return classes.join(" ")
  }

  let days = []
  let day = startDate

  while (day <= endDate) {
    days.push(day)
    day = dayjs(day).add(1, "day").format()
  }

  return (
    <article className={scss.days}>
      {days.map((d) => (
        <div key={d} className={dayCellClasses(d)} onClick={onClick(dayjs(d))}>
          {dayjs(d).format("D")}
        </div>
      ))}
    </article>
  )
}

const DateCalendar = ({ open, time, onCancel, onSubmit }) => {
  const setDate = useSetRecoilState(dateState)

  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => setCurrentMonth(dayjs(currentMonth).subtract(1, "M"))
  const nextMonth = () => setCurrentMonth(dayjs(currentMonth).add(1, "M"))

  const onDayClick = (day) => () => {
    setDate(day)
    setCurrentMonth(day)
  }

  const monthYear = dayjs(currentMonth).format("MMMM YYYY")
  const weekdays = Array.from(new Array(7).keys())

  return (
    <dialog className={scss.modal} open={open}>
      <nav className={scss.nav}>
        <p>{monthYear}</p>
        <button type="button" onClick={prevMonth}>
          <i className="icon-up-open" />
        </button>
        <button type="button" onClick={nextMonth}>
          <i className="icon-down-open" />
        </button>
      </nav>
      <header className={scss.weekdays}>
        {weekdays.map((day) => (
          <abbr key={day} title={dayjs().day(day).format("dddd")}>
            {dayjs().day(day).format("dd")}
          </abbr>
        ))}
      </header>
      <DayCells currentMonth={currentMonth} onClick={onDayClick} />
      {time && <TimePicker />}
      <menu className={scss.action}>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" onClick={onSubmit}>
          Save
        </button>
      </menu>
    </dialog>
  )
}

export default DateCalendar
