"use client";

import { useGeneralData } from "@/app/hooks/fetch/useGeneralData";
import { findVersionProjectData } from "@/app/version-control-system/refactored-version-control-system/findVersionProjectData";
import { fetchFolders } from "@/services/fetch/fetchFolders";
import { Folder } from "@/types/workTypes";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function InformationPage() {

    // const projectData = findVersionProjectData(
    //     "34",
    //     "170"
    // );
    // const folders = fetchFolders(supabase, { projectId: 1})
//     const folders = useGeneralData<Folder>({
//         fetchGeneralDataParams: {
//             tableName: "folders",
//             categories: [],
//             options: {
//                 filters: {
//                     "project_id": "1",
//                     "name": "AI Models",
//                 }
//             }
//         },
//         reactQueryOptions: {
//             enabled: true,
//         }
//     })
// console.log("DSADASSA", folders);
    return <div>Information page!</div>;
}
