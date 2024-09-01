import { useGeneralData } from "@/src/hooks/fetch/useGeneralData";
import { ProjectGraph } from "@/src/types/versionControlTypes";

const useProjectGraph = (projectId: number, enabled?: boolean) => {
    return useGeneralData<ProjectGraph>({
        fetchGeneralDataParams: {
            tableName: "project_versions_graphs",
            categories: [],
            withCounts: true,
            options: {
                page: 1,
                itemsPerPage: 10,
                filters: { project_id: projectId },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
};

export default useProjectGraph;
