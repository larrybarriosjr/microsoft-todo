import React, { useState } from "react"
import { useSetRecoilState, useRecoilState } from "recoil"
import { taskListState, taskState } from "state/atoms"
import scss from "common/StarButton.module.scss"
import { Task } from "service/lovefield"
import { fetchTask } from "utils"

const StarButton = ({ id, starred, className }) => {
  const setTaskList = useSetRecoilState(taskListState)
  const [task, setTask] = useRecoilState(taskState)
  const [highlight, setHighlight] = useState(false)

  const highlightStar = (starred) => () => {
    if (starred) return
    setHighlight(true)
  }
  const unhighlightStar = () => setHighlight(false)

  const handleStarred = (e) => {
    e.stopPropagation()
    Task.patch({ taskId: id, taskStarred: !starred })
      .then((res) => setTaskList(res))
      .then(unhighlightStar)
      .then(() => task.id === id && fetchTask(id, setTask))
      .catch((err) => console.log(err))
  }

  const itemStarClass = `${scss["item-star"]}
    ${className} ${highlight && scss.starred}`
  const iconStarClass = starred
    ? `icon-star-filled ${scss.starred}`
    : "icon-star"

  return (
    <button
      type="button"
      className={itemStarClass}
      onMouseEnter={highlightStar(starred)}
      onMouseLeave={unhighlightStar}
      onClick={handleStarred}
    >
      <i className={iconStarClass} />
    </button>
  )
}

export default StarButton
