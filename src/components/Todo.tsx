import {
  createSignal,
  createEffect,
  Index,
  onMount,
  onCleanup,
  batch,
} from "solid-js"
import "./Counter.css"
import { repo } from "remult"
import { Task } from "../shared/Task.js"
import { TasksController } from "../shared/TasksController.js"

const taskRepo = repo(Task)

export default function TodoComponent() {
  const [tasks, setTasks] = createSignal<Task[]>()
  const [newTaskTitle, setNewTaskTitle] = createSignal("")
  // LiveQuery - createEffect(() =>
  //   taskRepo
  //     .find({
  //       orderBy: {
  //         createdAt: "asc",
  //       },
  //     })
  //     .then(setTasks)
  // )
  onMount(() => {
    onCleanup(
      taskRepo
        .liveQuery({ orderBy: { createdAt: "desc" } })
        .subscribe((info) => setTasks(info.applyChanges))
    )
  })
  async function addTask(e: Event) {
    e.preventDefault()
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle() })
      // LiveQuery -  setTasks([...tasks()!, newTask])
      setNewTaskTitle("") //[ ] why didn't clear the new task title?
    } catch (error) {
      alert((error as { message: string }).message)
    }
  }
  function setTask(value: Task) {
    setTasks([...tasks()!.map((t) => (t.id === value.id ? value : t))])
  }
  async function setCompleted(task: Task, event: Event) {
    const target = event.target as HTMLInputElement //[ ] discuss
    const updatedTask = await taskRepo.update(task.id, {
      completed: target.checked,
    })
    //LiveQuery - setTask(updatedTask)
  }
  async function setTitle(task: Task, event: Event) {
    const target = event.target as HTMLInputElement //[ ] discuss
    setTask({ ...task, title: target.value })
  }
  async function saveTask(task: Task) {
    try {
      const insertedTask = await taskRepo.save(task)
      //LiveQuery - setTask(insertedTask)
    } catch (err) {
      alert((err as { message: string }).message)
    }
  }
  async function deleteTask(task: Task) {
    try {
      await taskRepo.delete(task.id)
      //LiveQuery - setTasks(tasks()!.filter((t) => t.id !== task.id))
    } catch (err) {
      alert((err as { message: string }).message)
    }
  }
  async function setAllCompleted(completed: boolean) {
    TasksController.setAllCompleted(completed)
  }

  return (
    <div>
      <h1>Todos</h1>
      <main>
        <form>
          <input
            type="text"
            placeholder="What needs to be done?"
            onInput={(e) => setNewTaskTitle(e.currentTarget.value)}
          />
          <button onClick={addTask}>Add</button>
        </form>
        {/*[ ]  When using for, the input lost focus on each click, is there some id binding? */}
        {/*[ ] Pros and cons vs {tasks()&&tasks()!.map....}  (https://start.solidjs.com/core-concepts/data-loading)*/}
        <Index each={tasks()}>
          {(task) => (
            <div>
              <input
                type="checkbox"
                checked={task().completed}
                onChange={[setCompleted, task()]} //[] review call
              />
              <input value={task().title} onInput={[setTitle, task()]} />
              <button onClick={() => console.log(task())}>test</button>
              {/* doesn't work - the save gets an old version of the object */}
              <button onClick={[saveTask, task()]}>Save</button>
              <button onClick={[deleteTask, task()]}>Delete</button>
            </div>
          )}
        </Index>
        <div>
          <button onClick={[setAllCompleted, true]}>Set All Completed</button>
          {/*[ ] - this is not typed (I can send anything 
            in the second parameter and it'll not get type checked*/}
          <button onClick={[setAllCompleted, false]}>
            Set All Uncompleted
          </button>
        </div>
      </main>
    </div>
  )
}

//p1 - explore createAsync

//[ ] - Experimental decorators
//[ ] - how to handle complex objects? (Date, etc...)
//[ ] - how to handle unmount
//[ ] - resource vs effect vs mount
//[ ] - is there a way to provide For with an id for reference check?
