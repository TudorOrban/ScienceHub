"use client";

import React, { useState } from "react";
import { useDeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/app/contexts/general/PageSelectContext";
import { useProjectIdByName } from "@/app/hooks/utils/useProjectIdByName";
import { useExperimentsSearch } from "@/app/hooks/fetch/search-hooks/works/useExperimentsSearch";
import { WorkInfo } from "@/types/infoTypes";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
import { useObjectsWithUsers } from "@/app/hooks/fetch/search-hooks/works/useObjectsWithUsers";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
import GeneralList from "@/components/lists/GeneralList";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));
const CreateWorkForm = dynamic(
    () => import("@/components/forms/CreateWorkForm")
);

export default function ExperimentPage({
    params,
}: {
    params: { identifier: string; projectName: string };
}) {
    // States
    // - Create
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);
    const onCreateNew = () => {
        setCreateNewOn(!createNewOn);
    };


    // Contexts
    // - Delete
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();

    // - Select page
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
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
        experiments = transformToWorksInfo(
            mergedExperimentsData?.data,
            [],
            "experiments"
        );
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Experiments"}
                searchBarPlaceholder="Search Experiments..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                searchContext="Project General"
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
                className="border-b border-gray-300"
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateWorkForm
                        createNewOn={createNewOn}
                        onCreateNew={onCreateNew}
                    />
                </div>
            )}
            <div className="w-full">
                    <GeneralList
                        data={experiments || []}
                        columns={["Title", "Users"]}
                        isLoading={experimentsData.isLoading}
                        shouldPush={true}
                    />
            </div>
            <div className="flex justify-end my-4 mr-4">
                {experimentsData.totalCount &&
                    experimentsData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={experimentsData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
            </div>
        </div>
    );
}
