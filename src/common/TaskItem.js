import React from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { taskHiddenState, taskState, stepListState } from "state/atoms"
import scss from "common/TaskItem.module.scss"
import CheckButton from "./CheckButton"
import StarButton from "./StarButton"
import { fetchTask } from "utils"
import dayjs from "dayjs"

const TaskItem = ({ item }) => {
  const [task, setTask] = useRecoilState(taskState) // Task item
  const [taskHidden, setTaskHidden] = useRecoilState(taskHiddenState) // Drawer display status

  const bullet = "\u2022"

  const setStepList = useSetRecoilState(stepListState)

  const toggleTaskDrawer = (id) => () => {
    fetchTask(id, setTask, setStepList).then(() => {
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

  const StepsIndicator = () => {
    let icon = ""
    if (item.stepsCompleted === item.stepsTotal) {
      icon = <i className="icon-ok" />
    }
    return (
      <>
        {" "}
        {bullet} {icon}
        {item.stepsCompleted} of {item.stepsTotal}
      </>
    )
  }
  const DateIndicator = ({ date, dueDate, reminder }) => {
    let icon = ""
    if (dueDate) icon = <i className="icon-calendar-check-o" />
    if (reminder) icon = <i className="icon-bell" />
    const timeDiff = (dt) => {
      if (dayjs().isSame(dt, "day")) return "Today"
      if (dayjs().add(1, "day").isSame(dt, "day")) return "Tomorrow"
      return dayjs(dt).format("ddd, MMM D")
    }
    return (
      <>
        {" "}
        {bullet} {icon}
        {timeDiff(date)}
      </>
    )
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
      <p className={scss["item-category"]}>
        {item.listId || "Tasks"}
        {item.stepsTotal > 0 && <StepsIndicator />}
        {item.dueDate && <DateIndicator date={item.dueDate} dueDate />}
        {item.reminder && <DateIndicator date={item.reminder} reminder />}
      </p>
      <StarButton
        id={item.id}
        starred={item.starred}
        className={scss["item-star"]}
      />
    </li>
  )
}

export default TaskItem
