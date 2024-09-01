import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { Team } from "@/src/types/communityTypes";
import { SmallSearchOptions } from "@/src/types/utilsTypes";

export const useTeamsSearch = ({
    extraFilters,
    enabled,
    context,
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<Team>({
        fetchGeneralDataParams: {
            tableName: "teams",
            categories: ["users"],
            withCounts: true,
            options: {
                // searchByField: "team_username",
                tableFields: [
                    "id", "team_name", "team_username", "created_at", "updated_at"
                ],
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                },
                page: 1,
                itemsPerPage: 50,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },
        extraFilters: extraFilters,
        context: context || "Workspace General",
    });

    return useUnifiedSearch();
};
