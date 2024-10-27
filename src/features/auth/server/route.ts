import { ID } from "node-appwrite";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { loginSchema, registerSchema } from "../schemas";
import { deleteCookie, setCookie } from "hono/cookie"
import { sessionMiddleware } from "@/lib/session-middleware";

import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "../constants";

//zValidator的首參數
//params: 使用於從 URL 路徑中提取的參數，比如 /user/:id 中的 id
//query: 用於提取 URL 中的查詢參數，比如 /search?query=test 中的 query
//json: 使用於 JSON 請求體（body）中的數據，比如在 POST 或 PUT 請求中發送的 JSON 數據

const app = new Hono()
  .get(
    "/current",
    sessionMiddleware,
    (c) => {
      const user = c.get("user")
      return c.json({ data: user })
    }
  )
  .post(
    "/login",
    zValidator("json", loginSchema),
    async(c) => {
    const { email, password } = c.req.valid('json')

    const { account } = await createAdminClient()
    const session = await account.createEmailPasswordSession(
      email,
      password,
    )

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30
    })
    
    return c.json({ success: true })
  })
  .post(
    "/register",
    zValidator("json", registerSchema),
    async(c) => {
    const { name, email, password } = c.req.valid('json')

    const { account } = await createAdminClient()

    await account.create(
      ID.unique(),
      email,
      password,
      name,
    )

    const session = await account.createEmailPasswordSession(
      email,
      password,
    )

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30
    })
    
    return c.json({ success: true })
  })
  .post("/logout",
    sessionMiddleware,
    async(c) => {
      const account = c.get("account")

      deleteCookie(c, AUTH_COOKIE)
      await account.deleteSession("current")
      
      return c.json({ success: true })
    }
  )
export default app