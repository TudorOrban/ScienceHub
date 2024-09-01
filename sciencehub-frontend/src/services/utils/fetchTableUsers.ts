import { User } from "@/src/types/userTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

type ObjectUsers = {
    objectId: string;
    users: User[];
};

type FetchObjectUsersOptions = {
    objectIds: string[];
    tableName: string;
    roles?: string[];
};

export const fetchTableUsers = async (
    supabase: SupabaseClient<Database>,
    options: FetchObjectUsersOptions
): Promise<ObjectUsers[]> => {
    const { objectIds, tableName } = options;
    const tableNameId = `${tableName}_id`;
    const tableUserId = "user_id";

    // Fetch user_ids for each object_id from tableName_users table
    console.log("DSAqwe", tableName);
    let query = supabase
        .from(`${tableName}_users`)
        .select(`${tableNameId}, ${tableUserId}`)
        .in(tableNameId, objectIds);

    if (options.roles) {
        query = query.in("role", options.roles);
    }

    const objectUsersResponse = await query;

    if (objectUsersResponse.error) {
        throw objectUsersResponse.error;
    }

    const objectIdToUserIdsMap: Record<string, string[]> = {};
    for (const row of objectUsersResponse.data) {
        if (
            !objectIdToUserIdsMap[
                row[tableNameId as keyof typeof row] as string
            ]
        ) {
            objectIdToUserIdsMap[
                row[tableNameId as keyof typeof row] as string
            ] = [];
        }
        objectIdToUserIdsMap[
            row[tableNameId as keyof typeof row] as string
        ].push(row[tableUserId as keyof typeof row] as string);
    }

    // Fetch user details from users table using these userIds
    const allUserIds = Object.values(objectIdToUserIdsMap).flat();
    const usersResponse = await supabase
        .from("users")
        .select("id, username, full_name,avatar_url")
        .in("id", allUserIds);

    if (usersResponse.error) {
        throw usersResponse.error;
    }

    // Combine data to form the final array of ObjectUsers
    const finalData: ObjectUsers[] = objectIds.map((objectId) => {
        const userIds = objectIdToUserIdsMap[objectId] || [];
        const users = usersResponse.data
            .filter((user) => userIds.includes(user.id))
            .map((user) => ({
                id: user.id,
                username: user.username || "Unknown",
                fullName: user.full_name || "Unknown",
                avatarUrl: user.avatar_url || "",
            }));

        return {
            objectId,
            users,
        };
    });

    return finalData;
};
