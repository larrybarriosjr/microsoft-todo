import React, { useState } from "react"
import { useSetRecoilState } from "recoil"
import { taskItemsState, taskState, stepItemsState } from "state/atoms"
import scss from "common/CheckButton.module.scss"
import { Task, Step } from "service/lovefield"
import { fetchTask } from "utils"

const CheckButton = ({ id, completed, taskId, className }) => {
  const setTask = useSetRecoilState(taskState)
  const setTaskItems = useSetRecoilState(taskItemsState)
  const setStepItems = useSetRecoilState(stepItemsState)
  const [checkShown, setCheckShown] = useState(false)

  // Display icon on mouse enter
  const handleDisplayCheck = () => {
    if (completed) return // Do nothing if icon is already displayed
    setCheckShown(true)
  }
  // Hide icon on mouse leave
  const handleHideCheck = () => setCheckShown(false)

  // Patch task completed status on click
  const handleCompleted = async (e) => {
    e.stopPropagation() // Disable drawer toggle
    if (taskId) {
      await Step.patch(taskId, { id, completed: !completed })
        .then((res) => setStepItems(res))
        .then(handleHideCheck) // Hide icon to avoid rendering duplicates
        .catch((err) => console.log(err))
      await Task.get()
        .then((res) => setTaskItems(res))
        .catch((err) => console.log(err))
    } else {
      Task.patch({ id, completed: !completed })
        .then((res) => setTaskItems(res)) // Rerender list of task items
        .then(handleHideCheck) // Hide icon to avoid rendering duplicates
        .then(() => fetchTask(id, setTask, setStepItems)) // Sync info between list and drawer
        .catch((err) => console.log(err))
    }
  }

  // Style: Add color and checkmark when completed
  const itemCheckClass = `${scss["item-check"]} 
    ${completed && scss.checked} ${className}`

  return (
    <button
      type="button"
      className={itemCheckClass}
      onMouseEnter={handleDisplayCheck}
      onMouseLeave={handleHideCheck}
      onClick={handleCompleted}
    >
      {/* When completed, display icon */}
      {completed && <i className="icon-ok" />}

      {/* On hover, display icon only when not already completed */}
      {checkShown && <i className="icon-ok" />}
    </button>
  )
}

export default CheckButton
