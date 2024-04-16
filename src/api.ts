import { remult } from "remult"
import { remultSolidStart } from "./shared/remult-solid-start.js"
import { Task } from "./shared/Task.js"
import { TasksController } from "./shared/TasksController.js"
import { getSession } from "./routes/auth.server.js"

export const api = remultSolidStart({
  entities: [Task],
  controllers: [TasksController],
  admin: true,
  getUser: async () => {
    return (await getSession())?.data?.user
  },
})
