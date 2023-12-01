import { User } from "@/types/userTypes";
import { SmallSearchOptions } from "@/types/utilsTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";


export const useUsersSearch = ({
    extraFilters,
    enabled,
    context,
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<User>({
        fetchGeneralDataParams: {
            tableName: "users",
            categories: [],
            withCounts: true,
            options: {
                searchByField: "username",
                tableFields: [
                    "id", "full_name", "username"
                ],
                page: 1,
                itemsPerPage: 50,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
        extraFilters: extraFilters,
        context: context || "Workspace General",
    });

    return useUnifiedSearch();
};