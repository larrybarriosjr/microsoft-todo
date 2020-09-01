import React, { useState, useRef } from "react"
import scss from "layout/TaskLists.module.scss"
import { taskListsState } from "state/atoms"
import { List } from "service/lovefield"
import { useRecoilState } from "recoil"

const TaskLists = () => {
  const [taskLists, setTaskLists] = useRecoilState(taskListsState)

  const [dragFromOrder, setDragFromOrder] = useState(null)
  const [dragFromId, setDragFromId] = useState(null)
  const [taskList, setTaskList] = useState("")

  // List input element reference
  const taskListRef = useRef(null)

  // Set list item to move to different order
  const handleDragList = (e) => {
    const { order, id } = e.currentTarget.dataset
    setDragFromOrder(Number(order))
    setDragFromId(id)
  }

  // Prevent default event of disallowing drop
  const handleAllowDrop = (e) => {
    e.preventDefault()
  }

  // Update list order on drop
  const handleListsUpdate = (e) => {
    List.reorder(
      { id: dragFromId, order: dragFromOrder },
      Number(e.currentTarget.dataset.order)
    )
      .then((res) => setTaskLists(res))
      .catch((err) => console.log(err))
  }

  // Two-way binding for list input
  const handleChangeList = (e) => setTaskList(e.target.value)

  // Submit on enter
  const handleListSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      List.post({ name: taskList })
        .then((res) => setTaskLists(res))
        .then(() => setTaskList(""))
        .catch((err) => console.log(err))
    }
  }

  // Open remove list modal
  // const handleRemoveList = (list) => () => {
  //   setList(list)
  //   setListModal(true)
  // }

  return (
    <div className={scss.container}>
      <ul className={scss.lists}>
        {taskLists &&
          taskLists.map((item) => (
            <li
              key={item.id}
              data-id={item.id}
              data-order={item.order}
              draggable
              onDragOver={handleAllowDrop}
              onDragStart={handleDragList}
              onDrop={handleListsUpdate}
              onClick={() => console.log("List name: " + item.name)}
            >
              <i className="icon-bell" />
              <p>{item.name}</p>
              {/* <button
                type="button"
                className={scss["list-remove"]}
                onClick={handleRemoveList(item)}
              >
                <i className="icon-cancel" />
              </button> */}
            </li>
          ))}
      </ul>
      <form className={scss.list}>
        <i className="icon-plus" />
        <textarea
          rows={1}
          name="task-list"
          placeholder="New list"
          onChange={handleChangeList}
          onKeyPress={handleListSubmit}
          value={taskList}
          ref={taskListRef}
        />
      </form>
    </div>
  )
}

export default TaskLists
