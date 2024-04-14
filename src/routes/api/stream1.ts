import { APIEvent } from "@solidjs/start/server"

export function GET(event: APIEvent) {
  const headers = { "Content-Type": "text/event-stream" }

  const messages: string[] = []

  const stream = new ReadableStream({
    start: (controller) => {
      setInterval(() => {
        controller.enqueue("data: " + new Date().toISOString() + "\n\n")
      }, 1000)
      for (const message of messages) {
        controller.enqueue(message)
      }
    },
    cancel: () => {
      //response.write = () => {}
      //event.locals["_tempOnClose"]()
    },
  })
  return new Response(stream, { headers })
}
