import React from "react"
import { useSetRecoilState, useRecoilState } from "recoil"
import { taskListState, taskState } from "state/atoms"
import scss from "task-drawer/TaskMyDay.module.scss"
import { Task } from "service/lovefield"
import { fetchTask } from "utils"

const TaskMyDay = () => {
  const [task, setTask] = useRecoilState(taskState)
  const setTaskList = useSetRecoilState(taskListState)

  /**
   * Function for setting or removing My Day from the task.
   *
   * @param {Boolean} value
   */
  const patchMyDay = (value) => {
    Task.patch({ id: task.id, myDay: value })
      .then((res) => setTaskList(res))
      .then(() => fetchTask(task.id, setTask))
      .catch((err) => console.log(err))
  }

  // Set My Day to task if not already set
  const handleSetMyDay = () => {
    if (!task.myDay) patchMyDay(true)
  }
  // Remove My Day from task item
  const handleRemoveMyDay = () => patchMyDay(false)

  // Style: Set color to primary if task has my day
  const actionMyDayClass = task.myDay && scss["action-myday-checked"]

  return (
    <form className={actionMyDayClass}>
      <i className="icon-sun" onClick={handleSetMyDay} />
      <p onClick={handleSetMyDay}>
        {task.myDay ? "Added to My Day" : "Add to My Day"}
      </p>
      {task.myDay && (
        <button type="button" onClick={handleRemoveMyDay}>
          <i className="icon-cancel" />
        </button>
      )}
    </form>
  )
}

export default TaskMyDay
