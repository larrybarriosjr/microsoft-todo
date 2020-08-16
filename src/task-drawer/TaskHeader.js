import React, { useState, useEffect, useCallback, useRef } from "react"
import scss from "task-drawer/TaskHeader.module.scss"
import CheckButton from "common/CheckButton"
import StarButton from "common/StarButton"
import { Task } from "service/lovefield"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { taskState, taskListState } from "state/atoms"
import { debounce } from "utils"
import TaskSteps from "./TaskSteps"

const TaskHeader = () => {
  const task = useRecoilValue(taskState)
  const setTaskList = useSetRecoilState(taskListState)
  const [taskName, setTaskName] = useState("")

  // Task name input element reference
  const nameRef = useRef(null)

  // Deconstructed task object
  const { id, name, completed, starred } = task

  // Debounced function for patching task name (500ms delay)
  const patchNameDebounced = useCallback(
    debounce((id, name) =>
      Task.patch({ id, name })
        .then((res) => setTaskList(res))
        .catch((err) => console.log(err))
    ),
    []
  )

  // Disable enter key when typing in task name
  const disableEnter = (e) => {
    if (e.key === "Enter") e.preventDefault()
  }

  // Initialize task name input
  useEffect(() => {
    setTaskName(name)
  }, [name])

  // Automatically submit on task name change
  const handleChangeName = (e) => setTaskName(e.target.value)

  // Adjust textarea height automatically and debounce submission
  useEffect(() => {
    const inputEl = nameRef.current
    if (id && taskName) {
      inputEl.style.height = "1.5rem"
      inputEl.style.height = `${inputEl.scrollHeight}px`
      patchNameDebounced(id, taskName)
    }
  }, [id, taskName, patchNameDebounced, setTaskList])

  // Style: Strikethrough task name when completed
  const itemNameClass = `${scss["item-name"]} ${completed && scss.deleted}`

  return (
    <header className={scss.header}>
      <form className={scss.title}>
        <CheckButton
          id={id}
          completed={completed}
          className={scss["item-check"]}
        />
        <textarea
          rows={1}
          name="task-name"
          onChange={handleChangeName}
          onKeyPress={disableEnter}
          value={taskName}
          className={itemNameClass}
          ref={nameRef}
        />
        <StarButton id={id} starred={starred} className={scss["item-star"]} />
      </form>
      <TaskSteps />
    </header>
  )
}

export default TaskHeader
