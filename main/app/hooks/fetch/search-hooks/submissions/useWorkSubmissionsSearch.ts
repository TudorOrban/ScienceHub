import { MediumSearchOptions } from "@/types/searchTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { WorkSubmission, } from "@/types/versionControlTypes";

export const useWorkSubmissionsSearch = ({
    negativeFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch,
}: MediumSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<WorkSubmission>({
        fetchGeneralDataParams: {
            tableName: "work_submissions",
            categories: ["users"],
            withCounts: true,
            options: {
                page: page || 1,
                itemsPerPage: itemsPerPage || 50,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: includeRefetch,
        },
        extraFilters: extraFilters,
        negativeFilters: negativeFilters,
        context: context || "Workspace General",
    });

    return useUnifiedSearch();
};