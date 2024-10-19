import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { loginSchema, registerSchema } from "../schemas";

// Don't auto format this file
const app = new Hono()
    .post(
        "/login",
        zValidator("json", loginSchema),
        (ctx) => {
            const { email, password } = ctx.req.valid("json");

            console.log(email, password);

            return ctx.json({ email, password });
        }
    )
    .post(
        "/register",
        zValidator("json", registerSchema),
        (ctx) => {
            const { name, email, password } = ctx.req.valid("json");

            console.log(name, email, password);

            return ctx.json({ name, email, password });
        }
    )

export default app;
