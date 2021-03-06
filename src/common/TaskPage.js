import React, { useState, useEffect, useCallback } from "react"
import scss from "common/TaskPage.module.scss"
import dayjs from "dayjs"
import TaskItem from "common/TaskItem"
import { Task, List } from "service/lovefield"
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil"
import {
  pageState,
  taskItemsState,
  themeModalState,
  taskListsState,
  listState
} from "state/atoms"
import { pageListState, completedListState } from "state/selectors"
import ThemeModal from "./ThemeModal"
import { useLocalStorage, debounce } from "utils"

const TaskPage = ({ name }) => {
  const [bgImage, setBgImage] = useLocalStorage(
    "background-image",
    require("assets/barley-fields.jpg")
  )
  // local states
  const [submitHidden, setSubmitHidden] = useState(true)
  const [taskName, setTaskName] = useState("")
  const [showCompleted, setShowCompleted] = useState(true)
  const [themeModal, setThemeModal] = useRecoilState(themeModalState)
  const list = useRecoilValue(listState)
  const setTaskItems = useSetRecoilState(taskItemsState)
  const setTaskLists = useSetRecoilState(taskListsState)
  const page = useRecoilValue(pageState)
  const currentList = useRecoilValue(pageListState)
  const completedList = useRecoilValue(completedListState)
  const [listName, setListName] = useState("")

  // Debounced function for patching list name (500ms delay)
  const patchListDebounced = useCallback(
    debounce((id, name) =>
      List.patch({ id, name })
        .then((res) => setTaskLists(res))
        .catch((err) => console.log(err))
    ),
    []
  )

  // Disable enter key when typing in list name
  const disableEnter = (e) => {
    if (e.key === "Enter") e.preventDefault()
  }

  // Automatically submit on list name change
  const handleChangeList = (e) => setListName(e.target.value)

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
      Task.post({
        name: taskName,
        myDay: name === "My Day",
        starred: name === "Important",
        dueDate: name === "Planned" && new Date(dayjs().startOf("day")),
        listId: list.id
      })
        .then((res) => setTaskItems(res))
        .then(() => setTaskName(""))
        .then(() => setSubmitHidden(true))
        .catch((err) => console.log(err))
    }
  }
  const handleThemeModal = (e) => {
    e.stopPropagation()
    setThemeModal(!themeModal)
  }
  const handleCompletedDisplay = () => setShowCompleted(!showCompleted)
  const handleBgImage = (url) => () => setBgImage(require("assets/" + url))

  useEffect(() => {
    setListName(list.name)
  }, [list])

  // Adjust textarea height automatically and debounce submission
  useEffect(() => {
    if (list.id && listName) {
      patchListDebounced(list.id, listName)
    }
  }, [list, listName, patchListDebounced])

  useEffect(() => {
    const fetchInitialData = async () => {
      Promise.all([await Task.get(), await List.get()])
        .then(([taskRes, listRes]) => {
          setTaskItems(taskRes)
          setTaskLists(listRes)
        })
        .catch((err) => console.log(err))
    }
    fetchInitialData()
  }, [setTaskItems, setTaskLists])

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

  const listClass = page === "My Day" ? scss.list : `${scss.list} ${scss.lines}`
  const completedIcon = showCompleted ? "icon-down-open" : "icon-right-open"
  const completedClass =
    page === "My Day" ? scss.completed : `${scss.completed} ${scss["my-day"]}`

  return (
    <div
      className={scss.background}
      style={{
        "--background-image": `url("${page === "My Day" && bgImage}")`
      }}
    >
      <section className={scss.page}>
        <h2 className={scss.title}>
          <i className={icon()} />{" "}
          {listName ? (
            <input
              name="list-name"
              onChange={handleChangeList}
              onKeyPress={disableEnter}
              value={listName}
            />
          ) : (
            name
          )}
        </h2>
        <p className={scss.date}>{name === "My Day" && currentDate}</p>
        <div className={scss.settings}>
          <button
            className={scss.ellipsis}
            aria-label="Task drawer button"
            onClick={handleThemeModal}
          >
            <i className="icon-ellipsis" />
          </button>
          <ThemeModal image={bgImage} handleImage={handleBgImage} />
        </div>
        <article className={listClass}>
          <ul className={scss["todo-list"]}>
            {currentList &&
              currentList.map((item, i) => <TaskItem key={i} item={item} />)}
          </ul>
          {completedList.length ? (
            <button
              type="button"
              onClick={handleCompletedDisplay}
              className={completedClass}
            >
              <i className={completedIcon} />
              <p>Completed</p>
            </button>
          ) : null}
          {completedList.length && showCompleted ? (
            <ul>
              {completedList.map((item, i) => (
                <TaskItem key={i} item={item} />
              ))}
            </ul>
          ) : null}
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

export default TaskPage
