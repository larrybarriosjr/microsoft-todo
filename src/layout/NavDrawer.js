import React from "react"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { pageState, taskItemsState, listState } from "state/atoms"
import scss from "layout/NavDrawer.module.scss"
import { fetchNavList } from "utils"
import TaskLists from "layout/TaskLists"

const NavDrawer = () => {
  // global states
  const taskItems = useRecoilValue(taskItemsState)
  const [page, setPage] = useRecoilState(pageState)
  const setList = useSetRecoilState(listState)

  // send to specified page
  const goToPage = (page) => () => {
    setList({})
    setPage(page)
  }

  // styling classname variables
  const navButtonClass = (selected) =>
    `${scss["nav-button"]} ${page === selected ? scss.active : ""}`

  return (
    <aside className={scss.container}>
      <nav>
        <h1 className={scss.brand}>Microsoft To Do Clone</h1>
        <ul className={scss["nav-list"]}>
          {fetchNavList(taskItems).map((item) => (
            <li key={item.key} className={scss["nav-item"]}>
              <button
                onClick={goToPage(item.name)}
                className={navButtonClass(item.name)}
              >
                <i className={item.icon} />
                <p>{item.name}</p>
                <p>{item.amount}</p>
              </button>
            </li>
          ))}
        </ul>
        <hr className={scss.divider} />
        <TaskLists />
      </nav>
    </aside>
  )
}

export default NavDrawer
