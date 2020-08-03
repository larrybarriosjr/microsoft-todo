import React, { useState } from "react"
import scss from "common/DateCalendar.module.scss"
import dayjs from "dayjs"
import { useSetRecoilState } from "recoil"
import { reminderCalendarModalState } from "state/atoms"
import TimePicker from "./TimePicker"

const DayCells = ({ selectedDate, currentMonth, setCurrentMonth, onClick }) => {
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

const DateCalendar = ({ open }) => {
  const setReminderCalendarModal = useSetRecoilState(reminderCalendarModalState)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const prevMonth = () => setCurrentMonth(dayjs(currentMonth).subtract(1, "M"))
  const nextMonth = () => setCurrentMonth(dayjs(currentMonth).add(1, "M"))

  const handleReminderCalendarModalClose = () => setReminderCalendarModal(false)
  const handleReminderCalendarSubmit = () => console.log(new Date(selectedDate))

  const onDayClick = (day) => () => {
    setSelectedDate(day)
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
      <DayCells
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        onClick={onDayClick}
      />
      <TimePicker />
      <menu>
        <button type="button" onClick={handleReminderCalendarModalClose}>
          Cancel
        </button>
        <button type="button" onClick={handleReminderCalendarSubmit}>
          Save
        </button>
      </menu>
    </dialog>
  )
}

export default DateCalendar
