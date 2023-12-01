"use client";

import { useProjectIdByName } from "@/app/hooks/utils/useProjectIdByName";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { WorkInfo } from "@/types/infoTypes";
import { useDatasetsSearch } from "@/app/hooks/fetch/search-hooks/works/useDatasetsSearch";
import { useState } from "react";
import { useDeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/app/contexts/general/PageSelectContext";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
import GeneralList from "@/components/lists/GeneralList";
import { useObjectsWithUsers } from "@/app/hooks/fetch/search-hooks/works/useObjectsWithUsers";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));
const CreateWorkForm = dynamic(
    () => import("@/components/forms/CreateWorkForm")
);


export default function DatasetsPage({
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

    const datasetsData = useDatasetsSearch({
        extraFilters: { projects: projectId?.toString() || "0" },
        enabled: isProjectIdAvailable,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const mergedDatasetsData = useObjectsWithUsers({
        objectsData: datasetsData,
        tableName: "dataset",
        enabled: !!datasetsData,
    });


    // Getting data ready for display
    let datasets: WorkInfo[] = [];

    if (mergedDatasetsData?.data) {
        datasets = transformToWorksInfo(
            mergedDatasetsData?.data,
            [],
            "datasets"
        );
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Datasets"}
                searchBarPlaceholder="Search datasets..."
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
                    data={datasets || []}
                    columns={["Title", "Users"]}
                        isLoading={datasetsData.isLoading}
                        shouldPush={true}
                    />
            </div>
            <div className="flex justify-end my-4 mr-4">
                {datasetsData.totalCount &&
                    datasetsData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={datasetsData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
            </div>
        </div>
    );
}
