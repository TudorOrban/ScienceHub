import { createUseUnifiedSearch } from "@/src/hooks/fetch/search-hooks/useUnifiedSearch";
import { AIModel } from "@/src/types/workTypes";
import { SmallSearchOptions } from "@/src/types/utilsTypes";

export const useAIModelsSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch,
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<AIModel>({
        fetchGeneralDataParams: {
            tableName: "ai_models",
            categories: ["projects", "users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "updated_at", "title", "description", "public", "work_type", "link"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id"],
                    teams: ["id", "team_username", "team_name"],
                    projects: ["id", "name", "title"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: includeRefetch,
        },
        extraFilters: extraFilters,
        context: context || "Workspace General",
    });

    return useUnifiedSearch();
};