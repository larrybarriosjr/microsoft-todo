import React from "react"
import scss from "common/RemoveListModal.module.scss"
import { useRecoilState, useSetRecoilState } from "recoil"
import {
  listModalState,
  taskItemsState,
  listState,
  taskListsState,
  pageState
} from "state/atoms"
import { Task, List } from "service/lovefield"

const RemoveListModal = () => {
  const [list, setList] = useRecoilState(listState)
  const [listModal, setListModal] = useRecoilState(listModalState)
  const setPage = useSetRecoilState(pageState)
  const setTaskItems = useSetRecoilState(taskItemsState)
  const setTaskLists = useSetRecoilState(taskListsState)

  const handleCloseModal = () => {
    setListModal(false)
    setList({})
  }

  const handleRemoveList = async () => {
    await List.delete(list.id)
      .then((res) => setTaskLists(res))
      .then(() => setList({}))
      .then(() => setListModal(false))
      .catch((err) => console.log(err))
    await Task.get()
      .then((res) => setTaskItems(res))
      .then(() => setPage("Tasks"))
      .catch((err) => console.log(err))
  }

  const containerClass = listModal ? scss["modal-container"] : ""

  return (
    <aside className={containerClass}>
      <dialog open={listModal} className={scss["remove-modal"]}>
        <header>Delete list</header>
        <p>"{list.name}" will be permanently deleted.</p>
        <menu>
          <button type="button" onClick={handleCloseModal}>
            Cancel
          </button>
          <button type="button" onClick={handleRemoveList}>
            Delete
          </button>
        </menu>
      </dialog>
    </aside>
  )
}

export default RemoveListModal
