import React, { useState, useEffect, useCallback, useRef } from "react"
import scss from "task-drawer/TaskHeader.module.scss"
import CheckButton from "common/CheckButton"
import StarButton from "common/StarButton"
import { Task, Step } from "service/lovefield"
import { useRecoilValue, useSetRecoilState } from "recoil"
import {
  taskState,
  taskListState,
  stepListState,
  stepState,
  stepModalState
} from "state/atoms"
import { debounce } from "utils"
import { taskStepsState } from "state/selectors"

const TaskHeader = () => {
  const task = useRecoilValue(taskState)
  const taskSteps = useRecoilValue(taskStepsState)
  const setTaskList = useSetRecoilState(taskListState)
  const setStep = useSetRecoilState(stepState)
  const setStepList = useSetRecoilState(stepListState)
  const setStepModal = useSetRecoilState(stepModalState)
  const [taskName, setTaskName] = useState("")
  const [taskStep, setTaskStep] = useState("")

  // HTML Element References
  const nameRef = useRef(null)
  const stepRef = useRef(null)

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

  // Automatically submit on task step change
  const handleChangeStep = (e) => setTaskStep(e.target.value)

  //
  const handleStepSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      Step.post({ name: taskStep, taskId: id })
        .then((res) => setStepList(res))
        .then(() => setTaskStep(""))
        .catch((err) => console.log(err))
    }
  }

  const handleRemoveStep = (step) => () => {
    setStep(step)
    setStepModal(true)
  }

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
      <ul className={scss.steps}>
        {taskSteps &&
          taskSteps.map((item) => (
            <li key={item.id}>
              <CheckButton
                id={item.id}
                completed={item.completed}
                className={scss["step-check"]}
              />
              <p>{item.name}</p>
              <button
                type="button"
                className={scss["step-remove"]}
                onClick={handleRemoveStep(item)}
              >
                <i className="icon-cancel" />
              </button>
            </li>
          ))}
      </ul>
      <form className={scss.step}>
        <i className="icon-plus" />
        <textarea
          rows={1}
          name="task-step"
          placeholder={taskSteps.length ? "Next step" : "Add step"}
          onChange={handleChangeStep}
          onKeyPress={handleStepSubmit}
          value={taskStep}
          ref={stepRef}
        />
      </form>
    </header>
  )
}

export default TaskHeader
