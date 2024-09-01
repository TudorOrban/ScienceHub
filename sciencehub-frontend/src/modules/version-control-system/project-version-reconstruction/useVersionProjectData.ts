import { ProjectGraph } from "@/src/types/versionControlTypes";
import { findClosestSnapshot } from "./findClosestSnapshot";
import { ProjectLayout } from "@/src/types/projectTypes";
import { usePathData } from "./usePathData";

/**
 * Hook for determining the project data corresponding to a specified version.
 * Moved to backend
 */
export const useVersionProjectData = (
    projectGraph: ProjectGraph,
    versionId: string,
    enabled?: boolean
): ProjectLayout => {
    const { closestSnapshotVersionId, path } = findClosestSnapshot(projectGraph, versionId);

    console.log("ProjectGraph: ", projectGraph, versionId);
    console.log("CLOSEST SNAPSHOT AND PATH TO IT: ", closestSnapshotVersionId, path);

    const { projectSnapshotData, pathDeltas } = usePathData(
        closestSnapshotVersionId || "",
        path,
        enabled
    );

    console.log("PROJECT SNAPSHOT AND PATH DELTAs", projectSnapshotData, pathDeltas);

    let result: ProjectLayout = projectSnapshotData.snapshotData || {
        id: Number(projectGraph.projectId),
    };

    // for (const delta of pathDeltas) {
    //     result = applyProjectDelta({
    //         projectVersionId: versionId,
    //         projectData: result,
    //         projectDelta: delta,
    //     });
    // }

    return result;
};
