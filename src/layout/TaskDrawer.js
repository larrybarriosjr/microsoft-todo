import { useRecoilValue } from "recoil"
import { taskHiddenState } from "state/atoms"
import scss from "layout/TaskDrawer.module.scss"

const TaskDrawer = () => {
  const taskHidden = useRecoilValue(taskHiddenState)
  return (
    <aside className={scss.container} hidden={taskHidden}>
          </button>
          <input />
          <button>
            <i />
          </button>
        </form>
        <ul>
          <li>
            <button>
              <i />
            </button>
            <input />
            <button>x</button>
          </li>
        </ul>
        <form>
          <i />
          <input placeholder="Next step" />
        </form>
      </header>
      <section>
        <form>
          <i />
          <p>Add to My Day</p>
          <button>x</button>
        </form>
        <form>
          <i />
          <p>Remind me</p>
          <button>x</button>
        </form>
        <form>
          <i />
          <p>Add due date</p>
          <button>x</button>
        </form>
      </section>
      <section>
        <form>
          <textarea placeholder="Add note" />
        </form>
      </section>
      <footer>
        <form>
          <button>{">"}</button>
          <p>Created</p>
          <button>x</button>
        </form>
      </footer>
    </aside>
  )
}

export default TaskDrawer
