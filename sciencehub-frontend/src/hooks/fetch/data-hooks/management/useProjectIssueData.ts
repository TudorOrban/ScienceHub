import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { ProjectIssue } from "@/src/types/managementTypes";

export const useProjectIssueData = (
    issueId: number,
    enabled?: boolean,
    initialData?: FetchResult<ProjectIssue>
): HookResult<ProjectIssue> => {
    const issueData = useGeneralData<ProjectIssue>({
        fetchGeneralDataParams: {
            tableName: "project_issues",
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: [issueId],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            initialData: initialData,
        },
    });

    return issueData;
};
