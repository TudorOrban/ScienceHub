import { useGeneralData } from "@/src/hooks/fetch/useGeneralData";
import { WorkGraph } from "@/src/types/versionControlTypes";

const useWorkGraph = (workId: number, enabled?: boolean) => {
    return useGeneralData<WorkGraph>({
        fetchGeneralDataParams: {
            tableName: "work_versions_graphs",
            categories: [],
            withCounts: true,
            options: {
                page: 1,
                itemsPerPage: 10,
                filters: { work_id: workId },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
};

export default useWorkGraph;
