import React from "react"
import { useRecoilValue } from "recoil"
import { themeModalState } from "state/atoms"
import scss from "common/ThemeModal.module.scss"
import images from "state/background-image"

const ThemeModal = ({ image, handleImage }) => {
  const themeModal = useRecoilValue(themeModalState)

  return (
    <dialog
      open={themeModal}
      className={scss.modal}
      onClick={(e) => e.stopPropagation()}
    >
      <header>Theme</header>
      <section>
        {images.map((img) => (
          <button
            key={img.key}
            onClick={handleImage(img.url)}
            className={img.url === image ? scss.selected : ""}
          >
            <span>
              <img src={require("assets/" + img.url)} alt={img.alt} />
            </span>
          </button>
        ))}
      </section>
    </dialog>
  )
}

export default ThemeModal
