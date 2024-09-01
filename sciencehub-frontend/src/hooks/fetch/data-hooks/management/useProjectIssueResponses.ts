// TODO: Implement infinite query
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { ProjectIssueResponse } from "@/src/types/managementTypes";

export const useProjectIssueResponses = (
    issueId: number,
    enabled?: boolean,
    initialData?: FetchResult<ProjectIssueResponse>
): HookResult<ProjectIssueResponse> => {
    const issueResponsesData = useGeneralData<ProjectIssueResponse>({
        fetchGeneralDataParams: {
            tableName: "project_issue_responses",
            categories: [],
            withCounts: true,
            options: {
                tableFields: [
                    "id",
                    "created_at",
                    "content",
                    "project_issue_id",
                    "link",
                    "users(id, username, full_name, avatar_url)",
                ],
                filters: {
                    project_issue_id: Number(issueId),
                },
                page: 1,
                itemsPerPage: 10,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            initialData: initialData,
        },
    });

    return issueResponsesData;
};

// import { useInfiniteQuery } from "@tanstack/react-query";
// import { fetchProjectIssueResponses } from "@/src/services/fetch/fetchProjectIssueResponses";

// export const useProjectIssueResponses = (discussionId: number, itemsPerPage: number, enabled?: boolean) => {
//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//     } = useInfiniteQuery({
//         queryKey: ["projectIssueResponses", discussionId],
//         queryFn: ({ pageParam = 0 }) => fetchProjectIssueResponses(discussionId, pageParam, itemsPerPage),
//         getNextPageParam: (lastPage, allPages) => {
//             const morePagesExist = lastPage?.length === itemsPerPage;
//             if (morePagesExist) {
//                 return allPages.length;
//             }
//             return undefined;
//         }
//     })

//     return { data, fetchNextPage, hasNextPage };
// }