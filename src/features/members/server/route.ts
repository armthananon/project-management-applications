import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { Query } from "node-appwrite"

import { sessionMiddleware } from "@/lib/session-middleware"
import { createAdminClient } from "@/lib/appwrite"
import { getMember } from "../utils"

import { DATABASE_ID, MEMBERS_ID } from "@/config"
import { Member, MemberRole } from "../types"

const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (ctx) => {
            const { users } = await createAdminClient();
            const databases = ctx.get("databases");
            const user = ctx.get("user");
            const { workspaceId } = ctx.req.valid("query");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });
            
            if (!member) {
                return ctx.json({ error: "Unauthorized" }, 401)
            }

            const members = await databases.listDocuments<Member>(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", workspaceId)]
            );

            const populatedMembers = await Promise.all(
                members.documents.map(async (member) => {
                    const user = await users.get(member.userId);
                    return {
                        ...member,
                        name: user.name || user.email,
                        email: user.email
                    }
                })
            );

            return ctx.json({
                data: {
                    ...members,
                    documents: populatedMembers
                }
            })
        }
    )
    .delete(
        "/:memberId",
        sessionMiddleware,
        async (ctx) => {
            const { memberId } = ctx.req.param();
            const user = ctx.get("user");
            const databases = ctx.get("databases");

            const memberToDelete = await databases.getDocument(
                DATABASE_ID, 
                MEMBERS_ID, 
                memberId
            );

            const allMembersInWorkspace = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", memberToDelete.workspaceId)]
            );

            const member = await getMember({
                databases,
                workspaceId: memberToDelete.workspaceId,
                userId: user.$id
            });

            if (!member) {
                return ctx.json({ error: "Unauthorized" }, 401)
            }

            if (member.$id !== memberToDelete.userId && member.role !== MemberRole.ADMIN) {
                return ctx.json({ error: "Unauthorized" }, 401)
            }

            if (allMembersInWorkspace.total === 1) {
                return ctx.json({ error: "Cannot delete the last member" }, 400)
            }

            const admins = allMembersInWorkspace.documents.filter(member => member.role === MemberRole.ADMIN);
            if (admins.length === 1 && admins[0].userId === memberToDelete.userId) {
                return ctx.json({ error: "Cannot delete the last admin" }, 400)
            }

            await databases.deleteDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId
            );

            return ctx.json({ data: { $id: memberToDelete.$id } });
        }
    )
    .patch(
        "/:memberId",
        sessionMiddleware,
        zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
        async (ctx) => {
            const { memberId } = ctx.req.param();
            const { role } = ctx.req.valid("json");
            const user = ctx.get("user");
            const databases = ctx.get("databases");

            const memberToUpdate = await databases.getDocument(
                DATABASE_ID, 
                MEMBERS_ID, 
                memberId
            );

            const allMembersInWorkspace = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", memberToUpdate.workspaceId)]
            );

            const member = await getMember({
                databases,
                workspaceId: memberToUpdate.workspaceId,
                userId: user.$id
            });

            if (!member) {
                return ctx.json({ error: "Unauthorized" }, 401)
            }

            if (member.role !== MemberRole.ADMIN) {
                return ctx.json({ error: "Unauthorized" }, 401)
            }

            if (member.$id === memberToUpdate.userId) {
                return ctx.json({ error: "Cannot update your own role" }, 400)
            }

            if (allMembersInWorkspace.total === 1) {
                return ctx.json({ error: "Cannot downgrade the only member" }, 400)
            }

            await databases.updateDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId,
                {
                    role
                }
            );

            return ctx.json({ data: { $id: memberToUpdate.$id } });
        }
    )

export default app