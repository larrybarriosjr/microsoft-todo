import React, { useState, useRef } from "react"
import scss from "task-drawer/TaskSteps.module.scss"
import CheckButton from "common/CheckButton"
import { Step } from "service/lovefield"
import {
  stepListState,
  stepState,
  stepModalState,
  taskState
} from "state/atoms"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { taskStepsState } from "state/selectors"

const TaskSteps = () => {
  const task = useRecoilValue(taskState)
  const taskSteps = useRecoilValue(taskStepsState)
  const setStep = useSetRecoilState(stepState)
  const setStepList = useSetRecoilState(stepListState)
  const setStepModal = useSetRecoilState(stepModalState)
  const [taskStep, setTaskStep] = useState("")

  // Step input element reference
  const stepRef = useRef(null)

  // Two-way binding for step input
  const handleChangeStep = (e) => setTaskStep(e.target.value)

  // Submit on enter
  const handleStepSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      Step.post({ name: taskStep, taskId: task.id })
        .then((res) => setStepList(res))
        .then(() => setTaskStep(""))
        .catch((err) => console.log(err))
    }
  }

  // Open remove step modal
  const handleRemoveStep = (step) => () => {
    setStep(step)
    setStepModal(true)
  }

  return (
    <>
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
    </>
  )
}

export default TaskSteps
