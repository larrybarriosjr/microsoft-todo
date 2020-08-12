import React from "react"
import { useSetRecoilState, useRecoilState } from "recoil"
import { taskHiddenState, taskState, taskListState } from "state/atoms"
import scss from "task-drawer/TaskFooter.module.scss"
import { Task } from "service/lovefield"
import dayjs from "dayjs"

const TaskFooter = () => {
  const [task, setTask] = useRecoilState(taskState)
  const setTaskHidden = useSetRecoilState(taskHiddenState)
  const setTaskList = useSetRecoilState(taskListState)

  // Date formatted like Sat, September 16
  const dateCreated = dayjs(task.dateCreated).format("ddd, MMMM D")

  // Reset task item data and close task drawer
  const handleCloseDrawer = () => {
    setTask({})
    setTaskHidden(true)
  }

  // Delete chosen task item, reset data and close drawer
  const handleDeleteTask = () => {
    Task.delete(task.id)
      .then((res) => setTaskList(res))
      .then(handleCloseDrawer)
      .catch((err) => console.log(err))
  }

  return (
    <footer className={scss.footer}>
      <form>
        <button type="button" onClick={handleCloseDrawer}>
          <i className="icon-right-open" />
        </button>
        <p>Created on {dateCreated}</p>
        <button type="button" onClick={handleDeleteTask}>
          <i className="icon-trash" />
        </button>
      </form>
    </footer>
  )
}

export default TaskFooter
