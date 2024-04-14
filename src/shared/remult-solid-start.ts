import { APIEvent } from "@solidjs/start/server"
import type { ResponseRequiredForSSE } from "remult/SseSubscriptionServer.js"
import type {
  GenericResponse,
  RemultServerCore,
  RemultServerOptions,
  RemultServer,
} from "remult/server"
import { createRemultServer } from "remult/server"

export function remultSolidStart(
  options: RemultServerOptions<APIEvent>
): RemultSolidStartServer {
  let result = createRemultServer<APIEvent>(options, {
    buildGenericRequestInfo: (event) => ({
      url: event.request.url,
      method: event.request.method,
      on: (e: "close", do1: VoidFunction) => {
        if (e === "close") {
          event.locals["_tempOnClose"] = do1
        }
      },
    }),
    getRequestBody: (event) => event.request.json(),
  })
  const serverHandler = async (event: APIEvent) => {
    let sseResponse: Response | undefined = undefined
    event.locals["_tempOnClose"] = () => {}

    const response: GenericResponse & ResponseRequiredForSSE = {
      end: () => {},
      json: () => {},
      send: () => {},
      status: () => {
        return response
      },
      write: () => {},
      writeHead: (status, headers) => {
        if (status === 200 && headers) {
          const contentType = headers["Content-Type"]
          if (contentType === "text/event-stream") {
            const messages: string[] = []
            response.write = (x) => messages.push(x)
            const stream = new ReadableStream({
              start: (controller) => {
                for (const message of messages) {
                  controller.enqueue(message)
                }
                response.write = (data) => {
                  controller.enqueue(data)
                }
              },
              cancel: () => {
                response.write = () => {}
                event.locals["_tempOnClose"]()
              },
            })
            sseResponse = new Response(stream, { headers })
          }
        }
      },
    }

    const responseFromRemultHandler = await result.handle(event, response)
    if (sseResponse !== undefined) {
      return sseResponse
    }
    if (responseFromRemultHandler) {
      if (responseFromRemultHandler.html)
        return new Response(responseFromRemultHandler.html, {
          status: responseFromRemultHandler.statusCode,
          headers: {
            "Content-Type": "text/html",
          },
        })
      const res = new Response(JSON.stringify(responseFromRemultHandler.data), {
        status: responseFromRemultHandler.statusCode,
      })
      return res
    }
    return new Response("Not Found", {
      status: 404,
    })
  }

  const handler = {} //async ({ event, resolve }) => {
  //   if (event.url.pathname.startsWith(options!.rootPath!)) {
  //     const result = await serverHandler(event)
  //     if (result != null && result?.status != 404) return result
  //   }
  //   return new Promise<Response>((res) => {
  //     result.withRemult(event, undefined!, async () => {
  //       res(await resolve(event))
  //     })
  //   })
  // }
  return Object.assign(handler, {
    getRemult: (req: APIEvent) => result.getRemult(req),
    openApiDoc: (options: { title: string }) => result.openApiDoc(options),
    withRemult<T>(request: APIEvent, what: () => Promise<T>): Promise<T> {
      return result.withRemultAsync(request, what)
    },
    GET: serverHandler,
    PUT: serverHandler,
    POST: serverHandler,
    DELETE: serverHandler,
  })
}
type RequestHandler = (event: APIEvent) => Promise<Response>
export type RemultSolidStartServer = RemultServerCore<APIEvent> & {
  // Handle &
  withRemult: RemultServer<APIEvent>["withRemultAsync"]
  GET: RequestHandler
  PUT: RequestHandler
  POST: RequestHandler
  DELETE: RequestHandler
}
