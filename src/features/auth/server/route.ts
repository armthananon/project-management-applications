import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { deleteCookie, setCookie } from "hono/cookie";
import { loginSchema, registerSchema } from "../schemas";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";

// Don't auto format this file
const app = new Hono()
    .get(
        "/me",
        sessionMiddleware,
        async (ctx) => {
            const user = ctx.get("user");

            return ctx.json({ data: user });
        }
    )
    .post(
        "/login",
        zValidator("json", loginSchema),
        async (ctx) => {
            const { email, password } = ctx.req.valid("json");

            const { account } = await createAdminClient();
            const session = await account.createEmailPasswordSession(email, password);

            setCookie(ctx, AUTH_COOKIE, session.secret, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30,
            })

            return ctx.json({ success: true });
        }
    )
    .post(
        "/register",
        zValidator("json", registerSchema),
        async (ctx) => {
            const { name, email, password } = ctx.req.valid("json");

            const { account } = await createAdminClient();
            await account.create(ID.unique(), email, password, name);

            const session = await account.createEmailPasswordSession(email, password);

            setCookie(ctx, AUTH_COOKIE, session.secret, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30,
            })

            return ctx.json({ success: true });
        }
    )
    .post(
        "/logout",
        sessionMiddleware,
        async (ctx) => {
            const account = ctx.get("account");

            deleteCookie(ctx, AUTH_COOKIE);
            await account.deleteSession("current");
            
            return ctx.json({ success: true });
        }
    )

export default app;
