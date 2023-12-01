import { useGeneralData } from "@/app/hooks/fetch/useGeneralData";
import { ProjectDelta, ProjectGraph } from "@/types/versionControlTypes";
import { keysToCamelCase, shallowEqual } from "@/utils/functions";
import { useEffect, useState } from "react";
import deepEqual from "fast-deep-equal";

const useProjectGraph = (projectId: number, enabled?: boolean) => {
    const projectGraphData = useGeneralData<ProjectGraph>({
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

    const [projectGraph, setProjectGraph] = useState<ProjectGraph | null>(null);

    useEffect(() => {
        const firstProjectGraph = projectGraphData
            ? projectGraphData.data[0]
            : null;

        if (firstProjectGraph) {
            // const transformedProjectGraph = keysToCamelCase(firstProjectGraph);
            if (!deepEqual(firstProjectGraph, projectGraph)) {
                setProjectGraph(firstProjectGraph);
            }
        }
    }, [projectGraphData.data]);

    return {
        projectGraph,
        isLoading: projectGraphData.isLoading,
        error: projectGraphData.serviceError,
    };
};

export default useProjectGraph;
