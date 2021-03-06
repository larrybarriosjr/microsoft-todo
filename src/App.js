import React from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import {
  pageState,
  reminderModalState,
  dueDateModalState,
  themeModalState
} from "state/atoms"
import "App.scss"
import NavDrawer from "layout/NavDrawer"
import TaskPage from "common/TaskPage"
import TaskDrawer from "task-drawer/TaskDrawer"
import RemoveStepModal from "common/RemoveStepModal"
import RemoveListModal from "common/RemoveListModal"

function App() {
  const page = useRecoilValue(pageState)
  const setReminderModal = useSetRecoilState(reminderModalState)
  const setDueDateModal = useSetRecoilState(dueDateModalState)
  const setThemeModal = useSetRecoilState(themeModalState)

  // Close all modals when clicking anywhere outside the modal
  const closeAllModals = () => {
    setReminderModal(false)
    setDueDateModal(false)
    setThemeModal(false)
  }

  return (
    <main onClick={closeAllModals}>
      <NavDrawer />
      <TaskPage name={page} />
      <TaskDrawer />
      <RemoveStepModal />
      <RemoveListModal />
    </main>
  )
}

export default App
