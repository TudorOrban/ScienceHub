import { createUseUnifiedSearch } from "@/hooks/fetch/search-hooks/useUnifiedSearch";
import { AIModel } from "@/types/workTypes";
import { SmallSearchOptions } from "@/types/utilsTypes";

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
                tableFields: ["id", "created_at", "updated_at", "title", "description", "public", "work_type"],
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