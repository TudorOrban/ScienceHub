// import { useProjectSnapshotData } from "@/hooks/fetch/data-hooks/management/useProjectSnapshotData";
// import { useProjectDeltaSearch } from "@/hooks/fetch/search-hooks/submissions/useProjectDeltaSearch";
// import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
// import {
//     ProjectDelta,
//     ProjectSnapshot,
//     VersionsProjectDeltas,
// } from "@/types/versionControlTypes";

// type UsePathDataOutput = {
//     projectSnapshotData: ProjectSnapshot;
//     pathDeltas: ProjectDelta[];
// };

// export const fetchPathData = (
//     closestSnapshotVersionId: string,
//     path: Record<string, string>,
// ): UsePathDataOutput => {
//     const projectSnapshotData = useProjectSnapshotData(
//         Number(closestSnapshotVersionId)
//     );
//     console.log("PROJECTSNAPSHOT", projectSnapshotData);

//     const initialVersionIds = Object.keys(path);
//     const finalVersionIds = Object.values(path);

//     // const pathDeltas = fetchGeneralData<ProjectDelta>(
//     //     initialVersionIds,
//     //     finalVersionIds,
//     // );

//     // if (!projectSnapshotData || !pathDeltas) {
//     //     const noSnapshotData: ProjectSnapshot = {
//     //         id: 0,
//     //         projectId: 0,
//     //         projectVersionId: 0,
//     //         createdAt: "",
//     //         snapshotData: { id: 0, public: true },
//     //     };

//     //     const noProjectDelta: ProjectDelta[] = [{
//     //         id: 0,
//     //         initialProjectVersionId: 0,
//     //         finalProjectVersionId: 0,
//     //         deltaData: {},
//     //     }];

//     //     return {
//     //         projectSnapshotData: noSnapshotData,
//     //         pathDeltas: noProjectDelta,
//     //     };
//     // }

//     // return {
//     //     projectSnapshotData: projectSnapshotData.data[0],
//     //     pathDeltas: pathDeltas.data,
//     // };
// };

// /* 

// {
//     "overview": {
//         "license": "MIT",
//         ...
//     },
//     "experiments": [
//         "AF Experiment 1": {
//             "id": "1",
//             "work_submission_id": "3",
//         }
//     ]

// }

// */