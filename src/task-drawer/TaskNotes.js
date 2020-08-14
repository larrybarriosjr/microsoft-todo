import React, { useState, useEffect, useCallback, useRef } from "react"
import { Task } from "service/lovefield"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { taskState, taskListState } from "state/atoms"
import { debounce } from "utils"

const TaskNotes = () => {
  const task = useRecoilValue(taskState)
  const setTaskList = useSetRecoilState(taskListState)
  const [taskNotes, setTaskNotes] = useState("")

  // HTML Element References
  const notesRef = useRef(null)

  // Deconstructed task object
  const { id, notes } = task

  // Debounced function for patching task name (500ms delay)
  const patchNotesDebounced = useCallback(
    debounce((id, notes) =>
      Task.patch({ id, notes })
        .then((res) => setTaskList(res))
        .catch((err) => console.log(err))
    ),
    []
  )

  // Initialize task name input
  useEffect(() => {
    setTaskNotes(notes)
  }, [notes])

  // Automatically submit on task notes change
  const handleChangeNotes = (e) => setTaskNotes(e.target.value)

  // Adjust textarea height automatically and debounce submission
  useEffect(() => {
    const inputEl = notesRef.current
    inputEl.style.height = "7.5rem"
    if (taskNotes) inputEl.style.height = `${inputEl.scrollHeight}px`
    if (id) patchNotesDebounced(id, taskNotes)
  }, [id, taskNotes, patchNotesDebounced, setTaskList])

  return (
    <form>
      <textarea
        rows="5"
        name="task-notes"
        placeholder="Add note"
        onChange={handleChangeNotes}
        value={taskNotes}
        ref={notesRef}
      />
    </form>
  )
}

export default TaskNotes
