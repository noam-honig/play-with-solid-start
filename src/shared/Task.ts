// src/shared/Task.ts

import { Entity, Fields, describeClass, remult } from "remult"

export class Task {
  id = ""
  title = ""
  completed = false
  createdAt?: Date
}

describeClass(
  Task,
  Entity("tasks", {
    allowApiCrud: true,
    apiPrefilter: () => {
      console.log(remult.user)
      return {}
    },
  }),
  {
    id: Fields.cuid(),
    title: Fields.string<Task>({
      validate: (task) => task.title.length > 2 || "Too Short",
    }),
    completed: Fields.boolean(),
    createdAt: Fields.createdAt(),
  }
)
