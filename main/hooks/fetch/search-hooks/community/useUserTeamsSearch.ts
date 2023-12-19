import { createUseUnifiedSearch } from "../../search-hooks/useUnifiedSearch";
import { Team } from "@/types/communityTypes";
import { SmallSearchOptions } from "@/types/utilsTypes";

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
                    "id", "team_name", "team_username"
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
        },
        extraFilters: extraFilters,
        context: context || "Workspace General",
    });

    return useUnifiedSearch();
};
