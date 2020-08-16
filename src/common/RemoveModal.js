import React from "react"
import scss from "common/RemoveModal.module.scss"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  stepState,
  stepModalState,
  taskState,
  stepListState,
  taskListState
} from "state/atoms"
import { Task, Step } from "service/lovefield"

const RemoveModal = () => {
  const task = useRecoilValue(taskState)
  const [step, setStep] = useRecoilState(stepState)
  const [stepModal, setStepModal] = useRecoilState(stepModalState)
  const setStepList = useSetRecoilState(stepListState)
  const setTaskList = useSetRecoilState(taskListState)

  const handleCloseModal = () => {
    setStepModal(false)
    setStep({})
  }

  const handleRemoveStep = async () => {
    await Step.delete(task.id, step.id)
      .then((res) => setStepList(res))
      .then(() => setStep({}))
      .then(() => setStepModal(false))
      .catch((err) => console.log(err))
    await Task.get()
      .then((res) => setTaskList(res))
      .catch((err) => console.log(err))
  }

  const containerClass = stepModal ? scss["modal-container"] : ""

  return (
    <aside className={containerClass}>
      <dialog open={stepModal} className={scss["remove-modal"]}>
        <header>Delete step</header>
        <p>"{step.name}" will be permanently deleted.</p>
        <menu>
          <button type="button" onClick={handleCloseModal}>
            Cancel
          </button>
          <button type="button" onClick={handleRemoveStep}>
            Delete
          </button>
        </menu>
      </dialog>
    </aside>
  )
}

export default RemoveModal
