import React from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { taskHiddenState, taskState } from "state/atoms"
import scss from "common/TaskItem.module.scss"
import { Task } from "service/lovefield"
import CheckButton from "./CheckButton"

const TaskItem = ({ item }) => {
  const setTask = useSetRecoilState(taskState)
  const [taskHidden, setTaskHidden] = useRecoilState(taskHiddenState)

  const toggleTaskDrawer = (id) => () => {
    setTaskHidden(!taskHidden)
    Task.get(id)
      .then((res) => setTask(res))
      .catch((err) => console.log(err))
  }
  const itemNameClass = `${scss["item-name"]} ${item.completed && scss.deleted}`

  return (
    <li className={scss["todo-item"]} onClick={toggleTaskDrawer(item.id)}>
      <CheckButton
        id={item.id}
        completed={item.completed}
        className={scss["item-check"]}
      />
      <p className={itemNameClass}>{item.name}</p>
      <p className={scss["item-category"]}>{item.listId || "Tasks"}</p>
      <button className={scss["item-star"]}>
        <i className={item.starred ? "icon-star-filled" : "icon-star"} />
      </button>
    </li>
  )
}

export default TaskItem
