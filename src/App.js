import React from "react"
import "App.scss"
import NavDrawer from "layout/NavDrawer"
import MyDayPage from "my-day/MyDayPage"

function App() {
  return (
    <main>
      <NavDrawer />
      <MyDayPage />
    </main>
  )
}

export default App
