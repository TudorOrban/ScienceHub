"use client";

import { useProjectIdByName } from "@/src/hooks/utils/useProjectIdByName";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import { WorkInfo } from "@/src/types/infoTypes";
import { useState } from "react";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import { useDeleteModeContext } from "@/src/contexts/general/DeleteModeContext";
import dynamic from "next/dynamic";
import { usePapersSearch } from "@/src/hooks/fetch/search-hooks/works/usePapersSearch";
import { defaultAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import { useObjectsWithUsers } from "@/src/hooks/fetch/search-hooks/useObjectsWithUsers";
import { transformToWorksInfo } from "@/src/utils/transforms-to-ui-types/transformToWorksInfo";
import WorkspaceTable from "@/src/components/lists/WorkspaceTable";
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));
const CreateWorkForm = dynamic(
    () => import("@/src/components/forms/CreateWorkForm")
)

export default function PapersPage({
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
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
                className="border-b border-gray-300"
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateWorkForm
                        createNewOn={createNewOn}
                        onCreateNew={() => setCreateNewOn(!createNewOn)}
                    />
                </div>
            )}
            <div className="w-full">
                <WorkspaceTable
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
