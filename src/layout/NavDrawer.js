import React, { useState } from "react"
import { useSetRecoilState } from "recoil"
import { pageState } from "state/atoms"
import scss from "layout/NavDrawer.module.scss"

const NavDrawer = () => {
  // global states
  const setPage = useSetRecoilState(pageState)

  // local states
  const [navDisplay, setNavDisplay] = useState("open")
  const [navIcon, setNavIcon] = useState("icon-left-open")

  // toggle navigation display and arrow icons
  const toggleNav = () => {
    if (navDisplay === "open") {
      setNavDisplay("close")
      setNavIcon("icon-right-open")
    } else {
      setNavDisplay("open")
      setNavIcon("icon-left-open")
    }
  }

  // send to specified page
  const goToPage = (page) => () => setPage(page)

  // styling classname variables
  const containerClass = `${scss.container} ${scss[navDisplay]}`
  const brandClass = `${scss.brand} ${scss[navDisplay]}`

  return (
    <aside className={containerClass}>
      <nav>
        <h1 className={brandClass}>
          {navDisplay === "open" ? "Microsoft To Do Clone" : "TD"}
        </h1>
        <ul>
          <li>
            <button onClick={goToPage("myDay")}>My Day</button>
          </li>
        </ul>
      </nav>
      <button
        className={scss.toggle}
        onClick={toggleNav}
        aria-label="Toggle drawer button"
      >
        <i className={navIcon} />
      </button>
    </aside>
  )
}

export default NavDrawer
