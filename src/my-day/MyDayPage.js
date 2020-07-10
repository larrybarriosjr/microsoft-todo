import React from "react"
import scss from "my-day/MyDayPage.module.scss"

const MyDayPage = () => {
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
          <input placeholder="Add a task" />
          <button type="button">
            <i className="icon-plus" />
          </button>
        </form>
      </section>
    </div>
  )
}

export default MyDayPage
