import React from "react"
import { useRecoilValue } from "recoil"
import { pageState } from "state/atoms"
import "App.scss"
import NavDrawer from "layout/NavDrawer"
import MyDayPage from "my-day/MyDayPage"

function App() {
  // global state
  const page = useRecoilValue(pageState)

  return (
    <main>
      <NavDrawer />
      {page === "myDay" && <MyDayPage />}
    </main>
  )
}

export default App
