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
        "public",
    ];

    if (includeWorkDelta) {
        workSubmissionsFields.push("work_delta");
    }

    const workSubmissionData = useGeneralData<WorkSubmission>({
        fetchGeneralDataParams: {
            tableName: "work_submissions",
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: [workSubmissionId],
                page: 1,
                itemsPerPage: 10,
                tableFields: workSubmissionsFields,
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
    return workSubmissionData;
};
