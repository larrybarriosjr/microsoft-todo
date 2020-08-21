import React, { useState, useEffect } from "react"
import scss from "common/TaskPage.module.scss"
import dayjs from "dayjs"
import TaskItem from "common/TaskItem"
import { Task } from "service/lovefield"
import { useSetRecoilState, useRecoilValue } from "recoil"
import { taskListState } from "state/atoms"
import { pageListState } from "state/selectors"

const MyDayPage = ({ name }) => {
  // local states
  const [submitHidden, setSubmitHidden] = useState(true)
  const [taskName, setTaskName] = useState("")
  const setTaskList = useSetRecoilState(taskListState)
  const currentList = useRecoilValue(pageListState)

  // formatted current date
  const currentDate = dayjs().format("dddd, MMMM D")

  // toggle submit display whether input is empty or not
  const handleInput = (e) => {
    setTaskName(e.target.value)
    setSubmitHidden(e.target.value.length === 0)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskName) {
      Task.post({ name: taskName })
        .then((res) => setTaskList(res))
        .then(() => setTaskName(""))
        .then(() => setSubmitHidden(true))
        .catch((err) => console.log(err))
    }
  }

  useEffect(() => {
    Task.get()
      .then((res) => setTaskList(res))
      .catch((err) => console.log(err))
  }, [setTaskList])

  const icon = () => {
    switch (name) {
      case "Important":
        return "icon-star"
      case "Planned":
        return "icon-calendar-check-o"
      case "Tasks":
        return "icon-home"
      default:
        break
    }
  }

  return (
    <div className={scss.background}>
      <section className={scss.page}>
        <h2 className={scss.title}>
          <i className={icon()} /> {name}
        </h2>
        <p className={scss.date}>{name === "My Day" && currentDate}</p>
        {/* <button className={scss.bulb} aria-label="Task drawer button">
          <i className="icon-lightbulb" />
        </button> */}
        <article className={scss.list}>
          <ul className={scss["todo-list"]}>
            {currentList &&
              currentList.map((item, i) => <TaskItem key={i} item={item} />)}
          </ul>
        </article>
        <form className={scss.form} onSubmit={handleSubmit}>
          <input
            name="task-name"
            placeholder={
              name === "Planned" ? "Add a task due today" : "Add a task"
            }
            onChange={handleInput}
            value={taskName}
            aria-label="Add task"
          />
          <button type="submit" hidden={submitHidden}>
            <i className="icon-plus" />
          </button>
        </form>
      </section>
    </div>
  )
}

export default MyDayPage
