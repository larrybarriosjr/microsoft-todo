import React from "react"
import { useRecoilValue, useRecoilState } from "recoil"
import { pageState, taskItemsState } from "state/atoms"
import scss from "layout/NavDrawer.module.scss"
import { fetchNavList } from "utils"
import TaskLists from "layout/TaskLists"

const NavDrawer = () => {
  // global states
  const taskItems = useRecoilValue(taskItemsState)
  const [page, setPage] = useRecoilState(pageState)

  // local states
  // const [navDisplay, setNavDisplay] = useState("open")
  // const [navIcon, setNavIcon] = useState("icon-left-open")

  // toggle navigation display and arrow icons
  // const toggleNav = () => {
  //   if (navDisplay === "open") {
  //     setNavDisplay("close")
  //     setNavIcon("icon-right-open")
  //   } else {
  //     setNavDisplay("open")
  //     setNavIcon("icon-left-open")
  //   }
  // }

  // send to specified page
  const goToPage = (page) => () => setPage(page)

  // styling classname variables
  // const containerClass = `${scss.container} ${scss[navDisplay]}`
  // const brandClass = `${scss.brand} ${scss[navDisplay]}`
  const navButtonClass = (selected) =>
    `${scss["nav-button"]} ${page === selected ? scss.active : ""}`

  return (
    <aside className={scss.container}>
      <nav>
        <h1 className={scss.brand}>
          {/* {navDisplay === "open" ? "Microsoft To Do Clone" : "TD"} */}
          Microsoft To Do Clone
        </h1>
        <ul className={scss["nav-list"]}>
          {fetchNavList(taskItems).map((item) => (
            <li key={item.key} className={scss["nav-item"]}>
              <button
                onClick={goToPage(item.name)}
                className={navButtonClass(item.key)}
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
      {/* <button
        className={scss.toggle}
        onClick={toggleNav}
        aria-label="Toggle drawer button"
      >
        <i className={navIcon} />
      </button> */}
    </aside>
  )
}

export default NavDrawer
