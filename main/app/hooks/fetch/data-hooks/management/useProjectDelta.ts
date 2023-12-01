import { ProjectDelta } from "@/types/versionControlTypes";
import { useGeneralData } from "../../useGeneralData";

export const useProjectDelta = (deltaId: string, enabled?: boolean) => {
    const projectDeltaData = useGeneralData<ProjectDelta>({
        fetchGeneralDataParams: {
            tableName: "project_deltas",
            categories: [],
            options: {
                tableRowsIds: [deltaId],
                page: 1,
                itemsPerPage: 5,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    return projectDeltaData;
};
