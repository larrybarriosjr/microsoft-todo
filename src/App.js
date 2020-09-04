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
import { Task } from "service/lovefield"
import dayjs from "dayjs"

function App() {
  window.self.addEventListener("notificationclick", (e) => {
    const registration = await window.navigator.serviceWorker.getRegistration()
    const options = {
      tag: e.tag,
      icon: "./favicon.ico",
      badge: "./favicon.ico",
      body: e.name,
      showTrigger: new window.TimestampTrigger(dayjs(e.tag).valueOf()),
      actions: [
        { action: "snooze-action", title: "Snooze 30 mins." },
        { action: "dismiss-action", title: "Dismiss" }
      ],
      data: {
        id: e.id,
        url: window.location.href,
        name: e.name
      },
      requireInteraction: true
    }
    switch (e.action) {
      case "snooze-action":
        console.log("ID: " + e.id)
        console.log("Tag: " + e.tag)
        console.log("URL: " + e.url)
        console.log("Snooze 30 minutes")
        window.location.href = e.url
        Task.patch({ id: e.id, reminder: new Date(dayjs().add(10, "second")) })
        .then(() => registration.showNotification("Task Reminder", options)) // Set PWA Notification
        break
      case "dismiss-action":
        console.log("ID: " + e.id)
        console.log("Tag: " + e.tag)
        console.log("URL: " + e.url)
        console.log("Dismiss")
        break
      default:
        console.log("Unknown action")
        break
    }
  })

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
