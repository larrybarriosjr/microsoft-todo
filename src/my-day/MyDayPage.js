import React, { useState } from "react"
import { useRecoilValue } from "recoil"
import { myDayListState } from "state/atoms"
import scss from "my-day/MyDayPage.module.scss"
import dayjs from "dayjs"

const MyDayPage = () => {
  // global states
  const myDayList = useRecoilValue(myDayListState)

  // local states
  const [submitHidden, setSubmitHidden] = useState(true)

  // formatted current date
  const currentDate = dayjs().format("dddd, MMMM D")

  // toggle submit display whether input is empty or not
  const handleInput = (e) => setSubmitHidden(e.target.value.length === 0)

  return (
    <div className={scss.background}>
      <section className={scss.page}>
        <h2 className={scss.title}>My Day</h2>
        <p className={scss.date}>{currentDate}</p>
        <button className={scss.bulb}>
          <i className="icon-lightbulb" />
        </button>
        <article className={scss.list}>
          <ul>
            {myDayList.map((item, i) => (
              <li key={i} className={scss["todo-item"]}>
                <button className={scss["item-check"]}>
                  {item.completed && <i className="icon-ok" />}
                </button>
                <p className={scss["item-name"]}>{item.name}</p>
                <p className={scss["item-description"]}>{item.description}</p>
                <button className={scss["item-star"]}>
                  <i
                    className={item.starred ? "icon-star-filled" : "icon-star"}
                  />
                </button>
              </li>
            ))}
          </ul>
        </article>
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
