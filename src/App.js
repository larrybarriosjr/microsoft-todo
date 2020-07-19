import React from "react"
import { useRecoilValue } from "recoil"
import { pageState } from "state/atoms"
import "App.scss"
import NavDrawer from "layout/NavDrawer"
import MyDayPage from "my-day/MyDayPage"
import TaskDrawer from "layout/TaskDrawer"

function App() {
  // global state
  const page = useRecoilValue(pageState)

  return (
    <main>
      <NavDrawer />
      {page === "myDay" && <MyDayPage />}
      <TaskDrawer />
    </main>
  )
}

export default App
