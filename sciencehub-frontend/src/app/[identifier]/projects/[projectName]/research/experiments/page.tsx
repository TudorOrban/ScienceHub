"use client";

import React, { useState } from "react";
import { useDeleteModeContext } from "@/src/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import { useProjectIdByName } from "@/src/hooks/utils/useProjectIdByName";
import { useExperimentsSearch } from "@/src/hooks/fetch/search-hooks/works/useExperimentsSearch";
import { WorkInfo } from "@/src/types/infoTypes";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import { useObjectsWithUsers } from "@/src/hooks/fetch/search-hooks/useObjectsWithUsers";
import { transformToWorksInfo } from "@/src/utils/transforms-to-ui-types/transformToWorksInfo";
import WorkspaceTable from "@/src/components/lists/WorkspaceTable";
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));
const CreateWorkForm = dynamic(() => import("@/src/components/forms/CreateWorkForm"));

export default function ExperimentPage({
    params,
}: {
    params: { identifier: string; projectName: string };
}) {
    // States
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);

    // Contexts
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const { data: projectId, error: projectIdError } = useProjectIdByName({
        projectName: params.projectName,
    });
    const isProjectIdAvailable = projectId != null && !isNaN(Number(projectId));

    const experimentsData = useExperimentsSearch({
        extraFilters: { projects: projectId?.toString() || "0" },
        enabled: isProjectIdAvailable,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const mergedExperimentsData = useObjectsWithUsers({
        objectsData: experimentsData,
        tableName: "experiment",
        enabled: !!experimentsData,
    });

    // Getting data ready for display
    let experiments: WorkInfo[] = [];

    if (mergedExperimentsData?.data) {
        experiments = transformToWorksInfo(mergedExperimentsData?.data, []);
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Experiments"}
                searchBarPlaceholder="Search Experiments..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                searchContext="Project General"
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
                className="border-b border-gray-300"
            />
            <div className="w-full">
                <WorkspaceTable
                    data={experiments || []}
                    columns={["Title", "Users"]}
                    isLoading={experimentsData.isLoading}
                />
            </div>
            <div className="flex justify-end my-4 mr-4">
                {experimentsData.totalCount && experimentsData.totalCount >= itemsPerPage && (
                    <PageSelect
                        numberOfElements={experimentsData?.totalCount || 10}
                        itemsPerPage={itemsPerPage}
                    />
                )}
            </div>
            
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateWorkForm createNewOn={createNewOn} onCreateNew={() => setCreateNewOn(!createNewOn)} />
                </div>
            )}
        </div>
    );
}
