import React from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { pageState, reminderModalState, dueDateModalState } from "state/atoms"
import "App.scss"
import NavDrawer from "layout/NavDrawer"
import MyDayPage from "my-day/MyDayPage"
import TaskDrawer from "task-drawer/TaskDrawer"
import RemoveModal from "common/RemoveModal"

function App() {
  const page = useRecoilValue(pageState)
  const setReminderModal = useSetRecoilState(reminderModalState)
  const setDueDateModal = useSetRecoilState(dueDateModalState)

  // Close all modals when clicking anywhere outside the modal
  const closeAllModals = () => {
    setReminderModal(false)
    setDueDateModal(false)
  }

  return (
    <main onClick={closeAllModals}>
      <NavDrawer />
      {/* Change task list content depending on page chosen */}
      {page === "myDay" && <MyDayPage />}
      <TaskDrawer />
      <RemoveModal />
    </main>
  )
}

export default App
