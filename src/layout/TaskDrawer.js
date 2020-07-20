import React, { useState, useEffect } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { taskHiddenState, taskListState, taskState } from "state/atoms"
import { Task } from "service/lovefield"
import scss from "layout/TaskDrawer.module.scss"

const TaskDrawer = () => {
  const taskHidden = useRecoilValue(taskHiddenState)
  const task = useRecoilValue(taskState)
  const setTaskList = useSetRecoilState(taskListState)
  const [taskId, setTaskId] = useState("")
  const [taskName, setTaskName] = useState("")
  const [checkShown, setCheckShown] = useState(false)

  const displayCheck = (completed) => () => {
    if (completed) return
    setCheckShown(true)
  }

  const hideCheck = () => setCheckShown(false)

  const handleChangeName = (e) => {
    setTaskName(e.target.value)
  }

  useEffect(() => {
    setTaskId(task.id)
    setTaskName(task.name)
  }, [task])

  useEffect(() => {
    if (taskId && taskName) {
      Task.patch({ taskId, taskName })
        .then((res) => setTaskList(res))
        .catch((err) => console.log(err))
    }
  }, [taskId, taskName, setTaskList])

  return (
    <aside className={scss.container} hidden={taskHidden}>
      <header className={scss.header}>
        <form className={scss.title}>
          <button
            type="button"
            onMouseEnter={displayCheck(task.completed)}
            onMouseLeave={hideCheck}
          >
            {task.completed && <i className="icon-ok" />}
            {checkShown && <i className="icon-ok" />}
          </button>
          <input
            name="task-name"
            onChange={handleChangeName}
            value={taskName || ""}
          />
          <button type="button">
            <i className={task.starred ? "icon-star-filled" : "icon-star"} />
          </button>
        </form>
        <ul>
          <li>
            <button>
              <i />
            </button>
            <input />
            <button>x</button>
          </li>
        </ul>
        <form>
          <i />
          <input placeholder="Next step" />
        </form>
      </header>
      <section>
        <form>
          <i />
          <p>Add to My Day</p>
          <button>x</button>
        </form>
        <form>
          <i />
          <p>Remind me</p>
          <button>x</button>
        </form>
        <form>
          <i />
          <p>Add due date</p>
          <button>x</button>
        </form>
      </section>
      <section>
        <form>
          <textarea placeholder="Add note" />
        </form>
      </section>
      <footer>
        <form>
          <button>{">"}</button>
          <p>Created</p>
          <button>x</button>
        </form>
      </footer>
    </aside>
  )
}

export default TaskDrawer
