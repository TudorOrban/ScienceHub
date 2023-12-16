import { User } from "@/types/userTypes";
import { useGeneralData } from "../fetch/useGeneralData";

export const useUsersSmall = (usersIds: string[], enabled?: boolean) => {
    const usersData = useGeneralData<User>({
        fetchGeneralDataParams: {
            tableName: "users",
            categories: [],
            withCounts: true,
            options: {
                tableRowsIds: usersIds,
                tableFields: ["id", "username", "full_name"],
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
