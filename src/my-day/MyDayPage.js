import React, { useState, useEffect } from "react"
import scss from "my-day/MyDayPage.module.scss"
import dayjs from "dayjs"
import TaskItem from "common/TaskItem"
import { Task } from "service/lovefield"
import { useSetRecoilState, useRecoilValue } from "recoil"
import { taskListState } from "state/atoms"
import { pageListState } from "state/selectors"

const MyDayPage = () => {
  // local states
  const [submitHidden, setSubmitHidden] = useState(true)
  const [taskName, setTaskName] = useState("")
  const setTaskList = useSetRecoilState(taskListState)
  const myDayList = useRecoilValue(pageListState)

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
      Task.post({ taskName })
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

  return (
    <div className={scss.background}>
      <section className={scss.page}>
        <h2 className={scss.title}>My Day</h2>
        <p className={scss.date}>{currentDate}</p>
        <button className={scss.bulb} aria-label="Task drawer button">
          <i className="icon-lightbulb" />
        </button>
        <article className={scss.list}>
          <ul className={scss["todo-list"]}>
            {myDayList &&
              myDayList.map((item, i) => <TaskItem key={i} item={item} />)}
          </ul>
        </article>
        <form className={scss.form} onSubmit={handleSubmit}>
          <input
            name="task-name"
            placeholder="Add a task"
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
