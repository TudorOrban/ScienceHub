"use client";

import { useProjectIdByName } from "@/hooks/utils/useProjectIdByName";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { WorkInfo } from "@/types/infoTypes";
import { useState } from "react";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import dynamic from "next/dynamic";
import { useCodeBlocksSearch } from "@/hooks/fetch/search-hooks/works/useCodeBlocksSearch";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
import { useObjectsWithUsers } from "@/hooks/fetch/search-hooks/works/useObjectsWithUsers";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
import GeneralList from "@/components/lists/GeneralList";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));
const CreateWorkForm = dynamic(
    () => import("@/components/forms/CreateWorkForm")
);

export default function CodeBlocksPage({
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

    const codeBlocksData = useCodeBlocksSearch({
        extraFilters: { projects: projectId?.toString() || "0" },
        enabled: isProjectIdAvailable,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const mergedCodeBlocksData = useObjectsWithUsers({
        objectsData: codeBlocksData,
        tableName: "code_block",
        enabled: !!codeBlocksData,
    })
    
    
    // Getting data ready for display
    let codeBlocks: WorkInfo[] = [];

    if (mergedCodeBlocksData?.data) {
        codeBlocks = transformToWorksInfo(mergedCodeBlocksData?.data, [], "code_blocks");
    }

   
    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Code Blocks"}
                searchBarPlaceholder="Search code blocks..."
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
                        data={codeBlocks || []}
                        columns={["Title", "Users"]}
                        isLoading={codeBlocksData.isLoading}
                        shouldPush={true}
                    />
            </div>
            <div className="flex justify-end my-4 mr-4">
                {codeBlocksData.totalCount &&
                    codeBlocksData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={codeBlocksData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
            </div>
        </div>
    );
}
