import { Query, type Databases } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID } from "@/config";

interface GetMemberProps {
    databases: Databases;
    workspaceId: string;
    userId: string;
}

export const getMember = async ({ databases, workspaceId, userId }: GetMemberProps) => {
    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [
            Query.and([
                Query.equal("userId", userId), 
                Query.equal("workspaceId", workspaceId)
            ])
        ]
    );

    return members.documents[0];
}