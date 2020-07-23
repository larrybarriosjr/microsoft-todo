import React, { useState, useEffect } from "react"
import { useSetRecoilState, useRecoilState } from "recoil"
import { taskHiddenState, taskListState, taskState } from "state/atoms"
import { Task } from "service/lovefield"
import dayjs from "dayjs"
import scss from "layout/TaskDrawer.module.scss"
import CheckButton from "common/CheckButton"
import StarButton from "common/StarButton"

const TaskDrawer = () => {
  const fetchTask = () =>
    Task.get(task.id)
      .then((res) => setTask(res))
      .catch((err) => console.log(err))

  const getInputHeight = (chars) => Math.ceil(chars / 22) * 1.75
  const [taskHidden, setTaskHidden] = useRecoilState(taskHiddenState)
  const [task, setTask] = useRecoilState(taskState)
  const setTaskList = useSetRecoilState(taskListState)
  const [taskId, setTaskId] = useState("")
  const [taskName, setTaskName] = useState("")
  const [taskMyDay, setTaskMyDay] = useState(false)
  const [taskNotes, setTaskNotes] = useState("")
  const [height, setHeight] = useState("1.75rem")

  const handleChangeName = (e) => {
    const inputLength = getInputHeight(e.target.value.length)
    setTaskName(e.target.value)
    setHeight((inputLength || 1.75) + "rem")
  }
  const handleChangeNotes = (e) => setTaskNotes(e.target.value)

  const handleMyDay = () => {
    if (!taskMyDay) {
      Task.patch({ taskId, taskMyDay: true })
        .then((res) => setTaskList(res))
        .then(() => task.id === taskId && fetchTask())
        .catch((err) => console.log(err))
    }
  }
  const handleRemoveMyDay = () => {
    Task.patch({ taskId, taskMyDay: false })
      .then((res) => setTaskList(res))
      .then(() => task.id === taskId && fetchTask())
      .catch((err) => console.log(err))
  }

  const handleCloseDrawer = () => {
    setTask({})
    setTaskHidden(true)
  }

  const handleDeleteTask = () => {
    Task.delete(taskId)
      .then((res) => setTaskList(res))
      .then(handleCloseDrawer)
      .catch((err) => console.log(err))
  }

  const disableEnter = (e) => {
    if (e.key === "Enter") e.preventDefault()
  }
  const dateCreated = dayjs(task.dateCreated).format("ddd, MMMM D")

  // Initialize task item
  useEffect(() => {
    setTaskId(task.id)
    setTaskName(task.name)
    setTaskMyDay(task.myDay)
    setTaskNotes(task.notes)
  }, [task])

  // Automatically submit and set input height on task name change
  useEffect(() => {
    if (taskId && taskName) {
      const syncData = async () => {
        await Task.patch({ taskId, taskName })
          .then((res) => setTaskList(res))
          .catch((err) => console.log(err))
        await Task.patch({ taskId, taskNotes })
          .then((res) => setTaskList(res))
          .catch((err) => console.log(err))
      }
      syncData()
      setHeight(getInputHeight(taskName.length) + "rem")
    }
  }, [taskId, taskName, taskNotes, setTaskList])

  const itemNameClass = `${scss["item-name"]} ${task.completed && scss.deleted}`
  const actionMyDayClass = `${scss["action-my-day"]}
    ${task.myDay && scss.checked}`

  return (
    <aside className={scss.container} hidden={taskHidden}>
      <header className={scss.header}>
        <form className={scss.title}>
          <CheckButton
            id={task.id}
            completed={task.completed}
            className={scss["item-check"]}
          />
          <textarea
            name="task-name"
            onChange={handleChangeName}
            onInput={handleChangeName}
            onKeyPress={disableEnter}
            value={taskName || ""}
            className={itemNameClass}
            style={{ height }}
          />
          <StarButton
            id={task.id}
            starred={task.starred}
            className={scss["item-star"]}
          />
        </form>
        <ul>
          <li>
            <button>
              <i />
            </button>
            <input />
            <button>x</button>
          </li>
        </ul>
        <form>
          <i />
          <input placeholder="Next step" />
        </form>
      </header>
      <section>
        <form className={actionMyDayClass}>
          <i className="icon-sun" onClick={handleMyDay} />
          <p onClick={handleMyDay}>
            {task.myDay ? "Added to My Day" : "Add to My Day"}
          </p>
          <button type="button" onClick={handleRemoveMyDay}>
            <i className="icon-cancel" />
          </button>
        </form>
        <form>
          <i className="icon-bell" />
          <p>Remind me</p>
          <button type="button">
            <i className="icon-cancel" />
          </button>
        </form>
        <form>
          <i className="icon-calendar-plus-o" />
          <p>Add due date</p>
          <button type="button">
            <i className="icon-cancel" />
          </button>
        </form>
      </section>
      <section>
        <form>
          <textarea
            rows="5"
            name="task-notes"
            placeholder="Add note"
            onChange={handleChangeNotes}
            value={taskNotes || ""}
          />
        </form>
      </section>
      <footer className={scss.footer}>
        <form>
          <button type="button" onClick={handleCloseDrawer}>
            <i className="icon-right-open" />
          </button>
          <p>Created on {dateCreated}</p>
          <button type="button" onClick={handleDeleteTask}>
            <i className="icon-trash" />
          </button>
        </form>
      </footer>
    </aside>
  )
}

export default TaskDrawer
