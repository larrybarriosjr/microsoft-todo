import React, { useState } from "react"
import { useSetRecoilState } from "recoil"
import { taskItemsState, taskState, stepItemsState } from "state/atoms"
import scss from "common/StarButton.module.scss"
import { Task } from "service/lovefield"
import { fetchTask } from "utils"

const StarButton = ({ id, starred, className }) => {
  const setTask = useSetRecoilState(taskState)
  const setTaskItems = useSetRecoilState(taskItemsState)
  const setStepItems = useSetRecoilState(stepItemsState)
  const [highlight, setHighlight] = useState(false)

  const highlightStar = (starred) => () => {
    if (starred) return
    setHighlight(true)
  }
  const unhighlightStar = () => setHighlight(false)

  const handleStarred = (e) => {
    e.stopPropagation()
    Task.patch({ id, starred: !starred })
      .then((res) => setTaskItems(res))
      .then(unhighlightStar)
      .then(() => fetchTask(id, setTask, setStepItems))
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
