import { AIModel, WorkIdentifier, Work } from "@/src/types/workTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { getObjectNames } from "@/src/config/getObjectNames";

export const useWorkDataByIdentifier = (
    workIdentifier: WorkIdentifier,
    enabled?: boolean
): HookResult<Work> => {
    const objectName = getObjectNames({ label: workIdentifier.workType });

    return useGeneralData<Work>({
        fetchGeneralDataParams: {
            tableName: objectName?.tableName || "",
            categories: ["users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "title", "description", "current_work_version_id", "work_type", "work_metadata", "link"],
                filters: {
                    id: workIdentifier.workId,
                    work_type: workIdentifier.workType,
                },
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    teams: ["id", "team_username", "team_name"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
};
