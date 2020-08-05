import React from "react"
import { useRecoilState } from "recoil"
import { taskHiddenState, taskState } from "state/atoms"
import scss from "common/TaskItem.module.scss"
import CheckButton from "./CheckButton"
import StarButton from "./StarButton"
import { fetchTask } from "utils"

const TaskItem = ({ item }) => {
  const [task, setTask] = useRecoilState(taskState) // Task item
  const [taskHidden, setTaskHidden] = useRecoilState(taskHiddenState) // Drawer display status

  const toggleTaskDrawer = (id) => () => {
    fetchTask(id, setTask).then(() => {
      if (!taskHidden && id !== task.id) {
        // Change drawer content when selecting new task item
        setTaskHidden(false)
      } else {
        // Close drawer if the task item is already selected
        // Open drawer when no task item is selected
        setTaskHidden(!taskHidden)
      }
    })
  }

  // Style: Strikethrough task name when completed
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
