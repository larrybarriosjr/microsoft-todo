import React, { useState } from "react"
import scss from "my-day/MyDayPage.module.scss"

const MyDayPage = () => {
  const [submitHidden, setSubmitHidden] = useState(true)
  const handleInput = (e) => setSubmitHidden(e.target.value.length === 0)

  return (
    <div className={scss.background}>
      <section className={scss.page}>
        <h2 className={scss.title}>My Day</h2>
        <p className={scss.date}>Friday, July 10</p>
        <button className={scss.bulb}>
          <i className="icon-lightbulb" />
        </button>
        <ul className={scss.list}>list</ul>
        <form className={scss.form}>
          <input placeholder="Add a task" onInput={handleInput} />
          <button type="button" hidden={submitHidden}>
            <i className="icon-plus" />
          </button>
        </form>
      </section>
    </div>
  )
}

export default MyDayPage
