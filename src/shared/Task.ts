import { Entity, Fields, describeClass } from "remult"

export class Task {
  id = ""
  title = ""
}
describeClass(
  Task,
  Entity("tasks", {
    allowApiCrud: true,
  }),
  {
    id: Fields.cuid(),
    title: Fields.string(),
  }
)
