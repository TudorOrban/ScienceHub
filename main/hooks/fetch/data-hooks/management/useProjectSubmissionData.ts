import { ProjectSubmission } from "@/types/versionControlTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useProjectSubmissionData = (
    projectSubmissionId: string,
    enabled?: boolean,
    includeWorkDeltas?: boolean
): HookResult<ProjectSubmission> => {
    const workSubmissionsFields = [
        "id",
        "work_id",
        "work_type",
        "initial_work_version_id",
        "final_work_version_id",
        "title",
        "public",
    ];

    if (includeWorkDeltas) {
        workSubmissionsFields.push("work_delta");
    }

    const projectSubmissionData = useGeneralData<ProjectSubmission>({
        fetchGeneralDataParams: {
            tableName: "project_submissions",
            categories: ["users", "work_submissions"],
            withCounts: true,
            options: {
                tableRowsIds: [projectSubmissionId],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                    work_submissions: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    work_submissions: workSubmissionsFields,
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    return projectSubmissionData;
};
