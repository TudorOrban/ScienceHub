import { ProjectVersion } from "@/types/versionControlTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useProjectVersionData = (
    projectVersionId: string,
    projectId?: string,
    enabled?: boolean,
): HookResult<ProjectVersion> => {

    const projectSubmissionData = useGeneralData<ProjectVersion>({
        fetchGeneralDataParams: {
            tableName: "project_versions",
            categories: ["users", "projects"],
            withCounts: true,
            options: {
                tableRowsIds: [projectVersionId],
                tableFields: ["id", "project_id", "version_number", "version_tag", "works"],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    projects: ["id", "title", "name"],
                },
                filters: !!projectId ? {
                    project_id: projectId,
                } : {},
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    return projectSubmissionData;
};
