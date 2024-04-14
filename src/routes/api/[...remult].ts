// server/api/[...remult].ts

import { Task } from "../../shared/Task.js"
import { APIEvent } from "@solidjs/start/server"
import { remultSolidStart } from "../../shared/remult-solid-start.js"
import { remult } from "remult"
const _api = remultSolidStart({
  entities: [Task],
  admin: true,
  initRequest: async () => {
    console.log(remult.subscriptionServer)
  },
})
if (!globalThis.i) globalThis.i = 1
console.log(globalThis.i++)

export const { GET, PUT, POST, DELETE } = _api
