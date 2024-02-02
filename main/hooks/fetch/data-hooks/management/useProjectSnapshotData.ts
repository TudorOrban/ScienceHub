import { useEffect, useState } from "react";
import { ProjectSnapshot } from "@/types/versionControlTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useProjectSnapshotData = (versionId: number, enabled?: boolean) => {
    const projectSnapshotData = useGeneralData<ProjectSnapshot>({
        fetchGeneralDataParams: {
            tableName: "project_snapshots",
            categories: [],
            options: {
                filters: { project_version_id: versionId },
                page: 1,
                itemsPerPage: 5,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    const [projectSnapshot, setProjectSnapshot] = useState<ProjectSnapshot>({
        id: 0,
        projectId: 0,
        projectVersionId: 0,
        snapshotData: { id: 0 },
    });

    useEffect(() => {
        const firstProjectSnapshot = projectSnapshotData ? projectSnapshotData.data[0] : null;

        if (firstProjectSnapshot) {
            // if (!isValidProjectLayout(firstProjectSnapshot)) {
            //     throw new Error("Invalid project snapshot");
            // }
            setProjectSnapshot(firstProjectSnapshot);
        }
    }, [projectSnapshotData]);

    const result: HookResult<ProjectSnapshot> = {
        data: [projectSnapshot],
        totalCount: projectSnapshotData.totalCount,
        isLoading: projectSnapshotData.isLoading,
        serviceError: projectSnapshotData.serviceError,
    };

    return result;
};

// function isValidProjectLayout(data: any): data is ProjectLayout {
//     return (
//         typeof data.id === "number" &&
//         typeof data.title === "string" /* other checks */
//     );
// }
