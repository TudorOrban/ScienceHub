import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { WorkIssueResponse } from "@/src/types/managementTypes";

export const useWorkIssueResponses = (
    issueId: number,
    enabled?: boolean,
    initialData?: FetchResult<WorkIssueResponse>
): HookResult<WorkIssueResponse> => {
    const issueData = useGeneralData<WorkIssueResponse>({
        fetchGeneralDataParams: {
            tableName: "work_issue_responses",
            categories: [],
            withCounts: true,
            options: {
                tableFields: [
                    "id",
                    "created_at",
                    "content",
                    "work_issue_id",
                    "link",
                    "users(id, username, full_name, avatar_url)",
                ],
                page: 1,
                itemsPerPage: 10,
                filters: {
                    work_issue_id: issueId,
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
