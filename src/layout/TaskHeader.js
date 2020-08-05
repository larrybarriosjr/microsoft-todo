import React, { forwardRef } from "react"
import scss from "layout/TaskHeader.module.scss"
import CheckButton from "common/CheckButton"
import StarButton from "common/StarButton"

const TaskHeader = (props, ref) => {
  const { id, name, completed, starred, onChange } = props

  // Disable enter key when typing in task name
  const disableEnter = (e) => {
    if (e.key === "Enter") e.preventDefault()
  }

  // Style: Strikethrough task name when completed
  const itemNameClass = `${scss["item-name"]} ${completed && scss.deleted}`

  return (
    <header className={scss.header}>
      <form className={scss.title}>
        <CheckButton
          id={id}
          completed={completed}
          className={scss["item-check"]}
        />
        <textarea
          rows={1}
          name="task-name"
          onChange={onChange}
          onKeyPress={disableEnter}
          value={name || ""}
          className={itemNameClass}
          ref={ref}
        />
        <StarButton id={id} starred={starred} className={scss["item-star"]} />
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
  )
}

export default forwardRef(TaskHeader)
