import { MetaProvider, Title } from "@solidjs/meta"
import { Router, action, createAsync, useAction } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js"
import "./app.css"
import { getSession, logout } from "./routes/auth.server.js"

export default function App() {
  const user = createAsync(async () => {
    "use server"
    const session = await getSession()
    return session.data
  })

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Suspense>
            <Title>SolidStart - Basic</Title>
            <div>Hello {user()?.user?.name}</div>
            <a href="/">Index</a> | <a href="/about">login</a>
            {props.children}
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
