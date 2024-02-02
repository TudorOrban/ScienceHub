import { useProjectSnapshotData } from "@/hooks/fetch/data-hooks/management/useProjectSnapshotData";
import { useProjectDeltaSearch } from "@/hooks/fetch/search-hooks/submissions/useProjectDeltaSearch";
import { ProjectDelta, ProjectSnapshot } from "@/types/versionControlTypes";

type UsePathDataOutput = {
    projectSnapshotData: ProjectSnapshot;
    pathDeltas: ProjectDelta[];
};

/**
 * Hook for fetching project deltas along a specified path.
 * Moved to backend
 */
export const usePathData = (
    closestSnapshotVersionId: string,
    path: Record<string, string>,
    enabled?: boolean
): UsePathDataOutput => {
    const projectSnapshotData = useProjectSnapshotData(Number(closestSnapshotVersionId));
    console.log("PROJECTSNAPSHOT", projectSnapshotData);

    const initialVersionIds = Object.keys(path);
    const finalVersionIds = Object.values(path);

    const pathDeltas = useProjectDeltaSearch(initialVersionIds, finalVersionIds, enabled);

    if (!projectSnapshotData || !pathDeltas) {
        const noSnapshotData: ProjectSnapshot = {
            id: 0,
            projectId: 0,
            projectVersionId: 0,
            createdAt: "",
            snapshotData: { id: 0, public: true },
        };

        return {
            projectSnapshotData: noSnapshotData,
            pathDeltas: [],
        };
    }

    return {
        projectSnapshotData: projectSnapshotData.data[0],
        pathDeltas: pathDeltas.data,
    };
};