import { User } from "@/src/types/userTypes";
import { useGeneralData } from "../fetch/useGeneralData";

export const useUsersSmall = (usersIds: (string| number)[], enabled?: boolean, includeAvatarUrl?: boolean) => {
    const tableFields = ["id", "username", "full_name"];
    if (includeAvatarUrl) {
        tableFields.push("avatar_url");
    }
    const usersData = useGeneralData<User>({
        fetchGeneralDataParams: {
            tableName: "users",
            categories: [],
            withCounts: true,
            options: {
                tableRowsIds: usersIds,
                tableFields: tableFields,
                page: 1,
                itemsPerPage: 100,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    return usersData;
};
