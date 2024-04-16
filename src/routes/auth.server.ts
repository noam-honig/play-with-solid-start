import { redirect } from "@solidjs/router"
import { useSession } from "vinxi/http"
import type { UserInfo } from "remult"

export async function login(formData: FormData) {
  const username = String(formData.get("username"))
  try {
    const session = await getSession()
    const user = validUsers.find((x) => x.name === username)
    if (!user)
      throw Error(
        "User not found. Please use one of the following: Jane, Steve."
      )
    await session.update({ user })
  } catch (err) {
    console.log(err)
    return err as Error
  }
  throw redirect("/")
}
export async function logout() {
  const session = await getSession()

  await session.update({ user: null! })
  throw redirect("/")
}

const validUsers: UserInfo[] = [
  { id: "1", name: "Jane" },
  { id: "2", name: "Steve" },
]

export async function getSession() {
  return await useSession<{ user?: UserInfo }>({
    password: "something secret really its very secret",
  })
}
