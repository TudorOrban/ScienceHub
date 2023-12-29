import { FetchResult } from "@/services/fetch/fetchGeneralData";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { WorkIssue } from "@/types/managementTypes";

export const useWorkIssueData = (
    issueId: number,
    enabled?: boolean,
    initialData?: FetchResult<WorkIssue>,
): HookResult<WorkIssue> => {
    const issueData = useGeneralData<WorkIssue>({
        fetchGeneralDataParams: {
            tableName: "work_issues",
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
