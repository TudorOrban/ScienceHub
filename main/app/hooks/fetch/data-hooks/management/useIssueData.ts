import { HookResult, useGeneralData } from "../../useGeneralData";
import { Issue } from "@/types/managementTypes";

export const useIssueData = (issueId: string, enabled?: boolean): HookResult<Issue> => {
    const issueData = useGeneralData<Issue>({
        fetchGeneralDataParams: {
            tableName: "issues",
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
        },
    });

    return issueData;
}

