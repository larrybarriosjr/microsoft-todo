import React, { useState } from "react"
import scss from "layout/NavDrawer.module.scss"

const NavDrawer = () => {
  // local states
  const [navDisplay, setNavDisplay] = useState("open")
  const [navIcon, setNavIcon] = useState("icon-left-open")

  const toggleNav = () => {
    if (navDisplay === "open") {
      setNavDisplay("close")
      setNavIcon("icon-right-open")
    } else {
      setNavDisplay("open")
      setNavIcon("icon-left-open")
    }
    console.log(navDisplay)
  }

  // styling classname variables
  const containerClass = `${scss.container} ${scss[navDisplay]}`
  const brandClass = `${scss.brand} ${scss[navDisplay]}`

  return (
    <aside className={containerClass}>
      <nav>
        <h1 className={brandClass}>
          {navDisplay === "open" ? "Futhark — Impel Focus" : "F"}
        </h1>
      </nav>
      <button className={scss.toggle} onClick={toggleNav}>
        <i className={navIcon} />
      </button>
    </aside>
  )
}

export default NavDrawer
