"use client";

import { useProjectIdByName } from "@/hooks/utils/useProjectIdByName";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { WorkInfo } from "@/types/infoTypes";
import { useState } from "react";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import dynamic from "next/dynamic";
import { usePapersSearch } from "@/hooks/fetch/search-hooks/works/usePapersSearch";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { useObjectsWithUsers } from "@/hooks/fetch/search-hooks/works/useObjectsWithUsers";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
import GeneralList from "@/components/lists/GeneralList";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));
const CreateWorkForm = dynamic(
    () => import("@/components/forms/CreateWorkForm")
)

export default function PapersPage({
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

    const papersData = usePapersSearch({
        extraFilters: { projects: projectId?.toString() || "0" },
        enabled: isProjectIdAvailable,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const mergedPapersData = useObjectsWithUsers({
        objectsData: papersData,
        tableName: "paper",
        enabled: !!papersData,
    });


    // Getting data ready for display
    let papers: WorkInfo[] = [];

    if (mergedPapersData?.data) {
        papers = transformToWorksInfo(
            mergedPapersData?.data,
            [],
        );
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Papers"}
                searchBarPlaceholder="Search Papers..."
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
                    data={papers || []}
                    columns={["Title", "Users"]}
                        isLoading={papersData.isLoading}
                    />
            </div>
            <div className="flex justify-end my-4 mr-4">
                {papersData.totalCount &&
                    papersData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={papersData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
            </div>
        </div>
    );
}
