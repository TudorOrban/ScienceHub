import { useProjectSnapshotData } from "@/app/hooks/fetch/data-hooks/management/useProjectSnapshotData";
import { useProjectDeltaSearch } from "@/app/hooks/fetch/search-hooks/submissions/useProjectDeltaSearch";
import {
    ProjectDelta,
    ProjectSnapshot,
    VersionsProjectDeltas,
} from "@/types/versionControlTypes";

type UsePathDataOutput = {
    projectSnapshotData: ProjectSnapshot;
    pathDeltas: ProjectDelta[];
};

export const usePathData = (
    closestSnapshotVersionId: string,
    path: Record<string, string>,
    enabled?: boolean
): UsePathDataOutput => {
    const projectSnapshotData = useProjectSnapshotData(
        Number(closestSnapshotVersionId)
    );
    console.log("PROJECTSNAPSHOT", projectSnapshotData);

    const initialVersionIds = Object.keys(path);
    const finalVersionIds = Object.values(path);

    const pathDeltas = useProjectDeltaSearch(
        initialVersionIds,
        finalVersionIds,
        enabled,
    );

    if (!projectSnapshotData || !pathDeltas) {
        const noSnapshotData: ProjectSnapshot = {
            id: 0,
            projectId: 0,
            projectVersionId: 0,
            createdAt: "",
            snapshotData: { id: 0, public: true },
        };

        const noProjectDelta: ProjectDelta[] = [{
            id: 0,
            initialProjectVersionId: 0,
            finalProjectVersionId: 0,
            deltaData: {},
        }];

        return {
            projectSnapshotData: noSnapshotData,
            pathDeltas: noProjectDelta,
        };
    }

    return {
        projectSnapshotData: projectSnapshotData.data[0],
        pathDeltas: pathDeltas.data,
    };
};

/* 

{
    "overview": {
        "license": "MIT",
        ...
    },
    "experiments": [
        "AF Experiment 1": {
            "id": "1",
            "work_submission_id": "3",
        }
    ]

}

*/