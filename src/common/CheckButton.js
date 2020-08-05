import React, { useState } from "react"
import { useSetRecoilState, useRecoilState } from "recoil"
import { taskListState, taskState } from "state/atoms"
import scss from "common/CheckButton.module.scss"
import { Task } from "service/lovefield"
import { fetchTask } from "utils"

const CheckButton = ({ id, completed, className }) => {
  const setTaskList = useSetRecoilState(taskListState)
  const [task, setTask] = useRecoilState(taskState)
  const [checkShown, setCheckShown] = useState(false)

  const displayCheck = (completed) => () => {
    if (completed) return
    setCheckShown(true)
  }
  const hideCheck = () => setCheckShown(false)

  const handleCompleted = (e) => {
    e.stopPropagation()
    Task.patch({ taskId: id, taskCompleted: !completed })
      .then((res) => setTaskList(res))
      .then(hideCheck)
      .then(() => task.id === id && fetchTask(id, setTask))
      .catch((err) => console.log(err))
  }

  const itemCheckClass = `${scss["item-check"]} 
    ${completed && scss.checked} ${className}`

  return (
    <button
      type="button"
      className={itemCheckClass}
      onMouseEnter={displayCheck(completed)}
      onMouseLeave={hideCheck}
      onClick={handleCompleted}
    >
      {completed && <i className="icon-ok" />}
      {checkShown && <i className="icon-ok" />}
    </button>
  )
}

export default CheckButton
