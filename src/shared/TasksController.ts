import { BackendMethod, describeClass, repo } from "remult"
import { Task } from "./Task.js"

export class TasksController {
  static async setAllCompleted(completed: boolean) {
    const taskRepo = await repo(Task)
    for (const task of await taskRepo.find()) {
      await taskRepo.update(task.id, { completed })
    }
  }
}
describeClass(TasksController, undefined, undefined, {
  setAllCompleted: BackendMethod({ allowed: true }),
})
