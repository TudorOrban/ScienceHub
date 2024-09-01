import { ProjectLayout } from "@/src/types/projectTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

const useProjectVersionedData = (projectId: number, enabled?: boolean): HookResult<ProjectLayout> => {
    const projectLayout = useGeneralData<ProjectLayout>({
        fetchGeneralDataParams: {
            tableName: "projects",
            categories: [
                "users",
            ],
            options: {
                tableRowsIds: [projectId],
                tableFields: [
                    "id", "title", "name", "title", "description", "project_metadata", "current_project_version_id"
                ],
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                }
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },
    });
    
    return projectLayout;
};

export default useProjectVersionedData;
