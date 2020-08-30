import React from "react"
import scss from "layout/TaskList.module.scss"

const TaskItems = () => {
  return (
    <ul className={scss.steps}>
      {taskSteps &&
        taskSteps.map((item) => (
          <li
            key={item.id}
            data-id={item.id}
            data-order={item.order}
            draggable
            onDragOver={handleAllowDrop}
            onDragStart={handleDragStep}
            onDrop={handleStepsUpdate}
          >
            <CheckButton
              id={item.id}
              completed={item.completed}
              taskId={item.taskId}
              className={scss["step-check"]}
            />
            <p className={item.completed ? scss.deleted : ""}>{item.name}</p>
            <button
              type="button"
              className={scss["step-remove"]}
              onClick={handleRemoveStep(item)}
            >
              <i className="icon-cancel" />
            </button>
          </li>
        ))}
    </ul>
  )
}

export default TaskItems
