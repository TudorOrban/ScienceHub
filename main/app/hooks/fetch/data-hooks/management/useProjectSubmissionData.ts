import { ProjectSubmission } from "@/types/versionControlTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useProjectSubmissionData = (projectSubmissionId: string, enabled?: boolean): HookResult<ProjectSubmission> => {
    const projectSubmissionData = useGeneralData<ProjectSubmission>({
        fetchGeneralDataParams: {
            tableName: "project_submissions",
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: [projectSubmissionId],
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
    return projectSubmissionData;
}
