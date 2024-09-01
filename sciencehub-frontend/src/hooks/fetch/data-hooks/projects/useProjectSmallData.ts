import { ProjectMedium } from "@/src/types/projectTypes";
import { useGeneralData } from "../../useGeneralData";

export const useProjectMediumData = (projectId: number, enabled: boolean) => {
    return useGeneralData<ProjectMedium>({
        fetchGeneralDataParams: {
            tableName: "projects",
            categories: [],
            options: {
                tableRowsIds: [projectId],
                tableFields: ["id", "title", "name", "current_project_version_id", "link"],
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },
    });
};
