import { ProjectSubmission } from "@/types/versionControlTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useProjectSubmissionData = (
    projectSubmissionId: number,
    enabled?: boolean,
    includeWorkDeltas?: boolean
): HookResult<ProjectSubmission> => {
    const projectSubmissionFields = [
        "id",
        "project_id",
        "initial_project_version_id",
        "final_project_version_id",
        "title",
        "status",
        "description",
        "submitted_data",
        "accepted_data",
        "project_delta",
        "public"
    ];
    const workSubmissionsFields = [
        "id",
        "work_id",
        "work_type",
        "initial_work_version_id",
        "final_work_version_id",
        "title",
        "status",
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
                tableFields: projectSubmissionFields,
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                    // teams: "fields",
                    work_submissions: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    // teams: ["id", "team_name", "team_username"],
                    work_submissions: workSubmissionsFields,
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },
    });
    return projectSubmissionData;
};
