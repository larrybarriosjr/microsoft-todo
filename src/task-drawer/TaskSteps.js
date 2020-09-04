import React, { useState, useRef } from "react"
import scss from "task-drawer/TaskSteps.module.scss"
import CheckButton from "common/CheckButton"
import { Task, Step } from "service/lovefield"
import {
  stepItemsState,
  stepState,
  stepModalState,
  taskState,
  taskItemsState
} from "state/atoms"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { taskStepsState } from "state/selectors"

const TaskSteps = () => {
  const task = useRecoilValue(taskState)
  const taskSteps = useRecoilValue(taskStepsState)
  const setStep = useSetRecoilState(stepState)
  const setStepItems = useSetRecoilState(stepItemsState)
  const setStepModal = useSetRecoilState(stepModalState)
  const setTaskItems = useSetRecoilState(taskItemsState)

  const [dragFromOrder, setDragFromOrder] = useState(null)
  const [dragFromId, setDragFromId] = useState(null)
  const [taskStep, setTaskStep] = useState("")

  // Step input element reference
  const stepRef = useRef(null)

  // Set step item to move to different order
  const handleDragStep = (e) => {
    const { order, id } = e.currentTarget.dataset
    setDragFromOrder(Number(order))
    setDragFromId(id)
  }

  // Prevent default event of disallowing drop
  const handleAllowDrop = (e) => {
    e.preventDefault()
  }

  // Update step order on drop
  const handleStepsUpdate = (e) => {
    Step.reorder(
      task.id,
      { id: dragFromId, order: dragFromOrder },
      Number(e.currentTarget.dataset.order)
    )
      .then((res) => setStepItems(res))
      .catch((err) => console.log(err))
  }

  // Two-way binding for step input
  const handleChangeStep = (e) => setTaskStep(e.target.value)

  // Submit on enter
  const handleStepSubmit = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      await Step.post({ name: taskStep, taskId: task.id })
        .then((res) => setStepItems(res))
        .then(() => setTaskStep(""))
        .catch((err) => console.log(err))
      await Task.get()
        .then((res) => setTaskItems(res))
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
            <li
              key={item.id}
              data-id={item.id}
              data-order={item.order}
              draggable
              onDragOver={handleAllowDrop}
              onDragStart={handleDragStep}
              onDrop={handleStepsUpdate}
            >
              <CheckButton
                id={item.id}
                completed={item.completed}
                taskId={item.taskId}
                className={scss["step-check"]}
              />
              <p className={item.completed ? scss.deleted : ""}>{item.name}</p>
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
