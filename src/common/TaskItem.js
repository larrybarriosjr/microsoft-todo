import React, { useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { taskHiddenState, taskState } from "state/atoms"
import scss from "common/TaskItem.module.scss"
import { Task } from "service/lovefield"

const TaskItem = ({ item }) => {
  const setTask = useSetRecoilState(taskState)
  const [taskHidden, setTaskHidden] = useRecoilState(taskHiddenState)
  const [checkShown, setCheckShown] = useState(false)

  const displayCheck = (completed) => () => {
    if (completed) return
    setCheckShown(true)
  }

  const hideCheck = () => setCheckShown(false)

  const toggleTaskDrawer = (id) => () => {
    setTaskHidden(!taskHidden)
    Task.get(id)
      .then((res) => setTask(res))
      .catch((err) => console.log(err))
  }

  return (
    <li className={scss["todo-item"]} onClick={toggleTaskDrawer(item.id)}>
      <button
        className={scss["item-check"]}
        onMouseEnter={displayCheck(item.completed)}
        onMouseLeave={hideCheck}
      >
        {item.completed && <i className="icon-ok" />}
        {checkShown && <i className="icon-ok" />}
      </button>
      <p className={scss["item-name"]}>{item.name}</p>
      <p className={scss["item-category"]}>{item.listId || "Tasks"}</p>
      <button className={scss["item-star"]}>
        <i className={item.starred ? "icon-star-filled" : "icon-star"} />
      </button>
    </li>
  )
}

export default TaskItem
