import { Hono } from "hono"
import { handle } from "hono/vercel"

import auth from "@/features/auth/server/route"
import workspaces from "@/features/workspaces/server/route"

const app = new Hono().basePath("/api")

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces)

//用hono/vercel取代掉next原本的GET/POST/PATCH...等方法
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)

export type AppType = typeof routes