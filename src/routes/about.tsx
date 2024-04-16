//[ ] - failed to rename this route to login or anything other than about

import { action } from "@solidjs/router"
import { login, logout } from "./auth.server.js"

export default function Home() {
  return (
    <>
      <main>
        <form
          action={action(async (e) => {
            "use server"
            await login(e)
            //[ ] got error about named action required
            //[ ] how to handle on the frontend a signIn error
          })}
          method="post"
        >
          <input
            type="text"
            name="username"
            placeholder="Username, try Steve or Jane"
          />
          <button>Sign in</button>
        </form>
        <form
          action={action(async (e) => {
            "use server"
            await logout()
          })}
          method="post"
        >
          <button> Sign out</button>
        </form>
      </main>
    </>
  )
}
