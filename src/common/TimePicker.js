import React from "react"
import { useRecoilState } from "recoil"
import { hourState, minuteState, periodState } from "state/atoms"
import scss from "common/TimePicker.module.scss"
import { hours, minutes, periods } from "state/time.json"

const TimePicker = () => {
  const [hour, setHour] = useRecoilState(hourState)
  const [minute, setMinute] = useRecoilState(minuteState)
  const [period, setPeriod] = useRecoilState(periodState)

  const handleHour = (e) => setHour(e.target.value)
  const handleMinute = (e) => setMinute(e.target.value)
  const handlePeriod = (e) => setPeriod(e.target.value)

  return (
    <article className={scss.time}>
      <select className={scss.hour} value={hour} onChange={handleHour}>
        {hours.map((h) => (
          <option key={h}>{h}</option>
        ))}
      </select>
      <select className={scss.minute} value={minute} onChange={handleMinute}>
        {minutes.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>
      <select className={scss.period} value={period} onChange={handlePeriod}>
        {periods.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
    </article>
  )
}

export default TimePicker
