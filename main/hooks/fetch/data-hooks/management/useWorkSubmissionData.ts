import { WorkSubmission } from "@/types/versionControlTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useWorkSubmissionData = (
    workSubmissionId: number,
    enabled?: boolean,
    includeWorkDelta?: boolean
): HookResult<WorkSubmission> => {
    const workSubmissionsFields = [
        "id",
        "work_id",
        "work_type",
        "initial_work_version_id",
        "final_work_version_id",
        "title",
        "status",
        "description",
        "submitted_data",
        "public",
    ];

    if (includeWorkDelta) {
        workSubmissionsFields.push("work_delta");
    }

    const workSubmissionData = useGeneralData<WorkSubmission>({
        fetchGeneralDataParams: {
            tableName: "work_submissions",
            categories: ["users", "teams"],
            withCounts: true,
            options: {
                tableRowsIds: [workSubmissionId],
                page: 1,
                itemsPerPage: 10,
                tableFields: workSubmissionsFields,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    teams: ["id", "team_name", "team_username"]
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    return workSubmissionData;
};
