import React, { useState, useRef } from "react"
import scss from "layout/TaskLists.module.scss"
import {
  taskListsState,
  pageState,
  listState,
  listModalState,
  taskItemsState
} from "state/atoms"
import { List } from "service/lovefield"
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil"

const TaskLists = () => {
  const [taskLists, setTaskLists] = useRecoilState(taskListsState)

  const [dragFromOrder, setDragFromOrder] = useState(null)
  const [dragFromId, setDragFromId] = useState(null)
  const [taskList, setTaskList] = useState("")

  const taskItems = useRecoilValue(taskItemsState)
  const setPage = useSetRecoilState(pageState)
  const setListModal = useSetRecoilState(listModalState)
  const [list, setList] = useRecoilState(listState)

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
  const handleRemoveList = (list) => (e) => {
    e.stopPropagation()
    setList(list)
    setListModal(true)
  }

  // send to specified page
  const goToPage = (list, page) => () => {
    setPage(page)
    setList(list)
  }

  // styling classname variables
  const listButtonClass = (selected) =>
    `${scss["list-button"]} ${list.id === selected ? scss.active : ""}`
  const nameClass = (selected) => (list.id === selected ? scss.active : "")

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
            >
              <button
                onClick={goToPage(item, item.name)}
                className={listButtonClass(item.id)}
              >
                <i className="icon-menu" />
                <p className={nameClass(item.id)}>{item.name}</p>
                <button
                  type="button"
                  className={scss["list-remove"]}
                  onClick={handleRemoveList(item)}
                >
                  <p>
                    {taskItems.filter((task) => task.listId === item.id).length}
                  </p>
                  <i className="icon-cancel" />
                </button>
              </button>
            </li>
          ))}
      </ul>
      <form className={scss.list}>
        <i className="icon-list-add" />
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
