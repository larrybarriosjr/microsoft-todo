import React from "react"
import { useSetRecoilState, useRecoilState } from "recoil"
import { taskListState, taskState } from "state/atoms"
import scss from "task-drawer/TaskMyDay.module.scss"
import { Task } from "service/lovefield"
import { fetchTask } from "utils"

const TaskMyDay = () => {
  const [task, setTask] = useRecoilState(taskState)
  const setTaskList = useSetRecoilState(taskListState)

  const handleMyDay = () => {
    if (!task.myDay) {
      Task.patch({ id: task.id, myDay: true })
        .then((res) => setTaskList(res))
        .then(() => fetchTask(task.id, setTask))
        .catch((err) => console.log(err))
    }
  }
  const handleRemoveMyDay = () => {
    Task.patch({ id: task.id, myDay: false })
      .then((res) => setTaskList(res))
      .then(() => fetchTask(task.id, setTask))
      .catch((err) => console.log(err))
  }

  const actionMyDayClass = task.myDay && scss["action-myday-checked"]

  return (
    <form className={actionMyDayClass}>
      <i className="icon-sun" onClick={handleMyDay} />
      <p onClick={handleMyDay}>
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
