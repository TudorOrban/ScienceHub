import { MediumSearchOptions } from "@/src/types/searchTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { WorkSubmission, WorkSubmissionSmall } from "@/src/types/versionControlTypes";

export const useWorkSubmissionsSearch = ({
    negativeFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch,
}: MediumSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<WorkSubmissionSmall>({
        fetchGeneralDataParams: {
            tableName: "work_submissions",
            categories: ["users"],
            withCounts: true,
            options: {
                tableFields: [
                    "id",
                    "created_at",
                    "work_id",
                    "work_type",
                    "initial_work_version_id",
                    "final_work_version_id",
                    "status",
                    "title",
                    "public",
                    "project_id",
                    "link",
                ],
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
