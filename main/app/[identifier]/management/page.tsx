"use client";

import useProjectGraph from "@/version-control-system/hooks/useProjectGraph";
import ProjectVersionGraph from "@/components/visualizations/ProjectVersionGraph";

export default function ManagementPage({
    params,
}: {
    params: { identifier: string; projectName: string };
}) {
    const projectId = 1;
    const isProjectIdAvailable = true;

    // Preliminaries
    const { identifier, projectName } = params;
    const projectGraphData = useProjectGraph(
        projectId || 0,
        isProjectIdAvailable
    );

    
    return (
        <div>
            Management!
            <ProjectVersionGraph
                projectGraph={
                    projectGraphData.data[0] || {
                        id: 0,
                        projectId: "",
                        graphData: {},
                    }
                }
                selectedVersionId={"21"}
                handleSelectGraphNode={() => {}}
                expanded={true}
            />
        </div>
    );
}
