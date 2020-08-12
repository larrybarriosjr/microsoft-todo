import React, { useState } from "react"
import { useSetRecoilState } from "recoil"
import { taskListState, taskState } from "state/atoms"
import scss from "common/CheckButton.module.scss"
import { Task } from "service/lovefield"
import { fetchTask } from "utils"

const CheckButton = ({ id, completed, className }) => {
  const setTask = useSetRecoilState(taskState)
  const setTaskList = useSetRecoilState(taskListState)
  const [checkShown, setCheckShown] = useState(false)

  // Display icon on mouse enter
  const handleDisplayCheck = () => {
    if (completed) return // Do nothing if icon is already displayed
    setCheckShown(true)
  }
  // Hide icon on mouse leave
  const handleHideCheck = () => setCheckShown(false)

  // Patch task completed status on click
  const handleCompleted = (e) => {
    e.stopPropagation() // Disable drawer toggle
    Task.patch({ id, completed: !completed })
      .then((res) => setTaskList(res)) // Rerender list of task items
      .then(handleHideCheck) // Hide icon to avoid rendering duplicates
      .then(() => fetchTask(id, setTask)) // Sync info between list and drawer
      .catch((err) => console.log(err))
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
