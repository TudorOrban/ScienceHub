"use client";

import useProjectGraph from "@/app/version-control-system/hooks/useProjectGraph";
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
    const { projectGraph, error: projectGraphError } = useProjectGraph(
        projectId || 0,
        isProjectIdAvailable
    );

    const isProjectGraphAvailable = projectGraph !== null;
    
    return (
        <div>
            Management!
            <ProjectVersionGraph
                projectGraph={
                    projectGraph || {
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
