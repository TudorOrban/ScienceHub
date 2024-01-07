import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { Experiment } from "@/types/workTypes";
import { SmallSearchOptions } from "@/types/utilsTypes";

export const useExperimentsSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch,
}: SmallSearchOptions) => {
    return createUseUnifiedSearch<Experiment>({
        fetchGeneralDataParams: {
            tableName: "experiments",
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
                    users: ["id", "username", "full_name"],
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
    })();
};