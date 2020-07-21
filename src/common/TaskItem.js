import React from "react"
import { useRecoilState } from "recoil"
import { taskHiddenState, taskState } from "state/atoms"
import scss from "common/TaskItem.module.scss"
import { Task } from "service/lovefield"
import CheckButton from "./CheckButton"
import StarButton from "./StarButton"

const TaskItem = ({ item }) => {
  const [task, setTask] = useRecoilState(taskState)
  const [taskHidden, setTaskHidden] = useRecoilState(taskHiddenState)

  const toggleTaskDrawer = (id) => () => {
    !taskHidden && id !== task.id
      ? setTaskHidden(false)
      : setTaskHidden(!taskHidden)
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
      <StarButton
        id={item.id}
        starred={item.starred}
        className={scss["item-star"]}
      />
    </li>
  )
}

export default TaskItem
