"use client";

import { useProjectIdByName } from "@/hooks/utils/useProjectIdByName";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { WorkInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { useDataAnalysesSearch } from "@/hooks/fetch/search-hooks/works/useDataAnalysesSearch";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { useObjectsWithUsers } from "@/hooks/fetch/search-hooks/works/useObjectsWithUsers";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
import WorkspaceTable from "@/components/lists/WorkspaceTable";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));
const CreateWorkForm = dynamic(() => import("@/components/forms/CreateWorkForm"));

export default function DataAnalysesPage({
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

    const dataAnalysesData = useDataAnalysesSearch({
        extraFilters: { projects: projectId?.toString() || "0" },
        enabled: isProjectIdAvailable,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const mergedDataAnalysesData = useObjectsWithUsers({
        objectsData: dataAnalysesData,
        tableName: "ai_model",
        enabled: !!dataAnalysesData,
    });

    // Getting data ready for display
    let dataAnalyses: WorkInfo[] = [];

    if (mergedDataAnalysesData?.data) {
        dataAnalyses = transformToWorksInfo(mergedDataAnalysesData?.data, []);
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Data Analyses"}
                searchBarPlaceholder="Search data analyses..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                searchContext="Project General"
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
                className="border-b border-gray-300"
            />
            <div className="w-full">
                <WorkspaceTable
                    data={dataAnalyses || []}
                    columns={["Title", "Users"]}
                    isLoading={dataAnalysesData.isLoading}
                />
            </div>
            <div className="flex justify-end my-4 mr-4">
                {dataAnalysesData.totalCount && dataAnalysesData.totalCount >= itemsPerPage && (
                    <PageSelect
                        numberOfElements={dataAnalysesData?.totalCount || 10}
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
