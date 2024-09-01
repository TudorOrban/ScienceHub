"use client";

import { useProjectIdByName } from "@/src/hooks/utils/useProjectIdByName";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import { WorkInfo } from "@/src/types/infoTypes";
import { useDatasetsSearch } from "@/src/hooks/fetch/search-hooks/works/useDatasetsSearch";
import { useState } from "react";
import { useDeleteModeContext } from "@/src/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import WorkspaceTable from "@/src/components/lists/WorkspaceTable";
import { useObjectsWithUsers } from "@/src/hooks/fetch/search-hooks/useObjectsWithUsers";
import { transformToWorksInfo } from "@/src/utils/transforms-to-ui-types/transformToWorksInfo";
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));
const CreateWorkForm = dynamic(() => import("@/src/components/forms/CreateWorkForm"));

export default function DatasetsPage({
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
        datasets = transformToWorksInfo(mergedDatasetsData?.data, []);
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Datasets"}
                searchBarPlaceholder="Search datasets..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                searchContext="Project General"
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
                className="border-b border-gray-300"
            />
            <div className="w-full">
                <WorkspaceTable
                    data={datasets || []}
                    columns={["Title", "Users"]}
                    isLoading={datasetsData.isLoading}
                />
            </div>
            <div className="flex justify-end my-4 mr-4">
                {datasetsData.totalCount && datasetsData.totalCount >= itemsPerPage && (
                    <PageSelect
                        numberOfElements={datasetsData?.totalCount || 10}
                        itemsPerPage={itemsPerPage}
                    />
                )}
            </div>

            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateWorkForm
                        createNewOn={createNewOn}
                        onCreateNew={() => setCreateNewOn(!createNewOn)}
                    />
                </div>
            )}
        </div>
    );
}
