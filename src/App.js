import React from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { pageState, reminderModalState } from "state/atoms"
import "App.scss"
import NavDrawer from "layout/NavDrawer"
import MyDayPage from "my-day/MyDayPage"
import TaskDrawer from "layout/TaskDrawer"

function App() {
  // global state
  const page = useRecoilValue(pageState)
  const setReminderModal = useSetRecoilState(reminderModalState)

  const closeAllModals = () => {
    setReminderModal(false)
  }

  return (
    <main onClick={closeAllModals}>
      <NavDrawer />
      {page === "myDay" && <MyDayPage />}
      <TaskDrawer />
    </main>
  )
}

export default App
