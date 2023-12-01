"use client";

import React, { useState } from "react";
import { Experiment, Work } from "@/types/workTypes";
import { worksPageNavigationMenuItems } from "@/utils/navItems.config";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import GeneralList from "@/components/lists/GeneralList";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { GeneralInfo } from "@/types/infoTypes";
import { usePageSelectContext } from "@/app/contexts/general/PageSelectContext";
import { useDeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import dynamic from "next/dynamic";
import { useAllUserWorks } from "@/app/hooks/fetch/search-hooks/works/useAllWorks";
import { worksAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
import { HookResult } from "@/app/hooks/fetch/useGeneralData";
const CreateWorkForm = dynamic(
    () => import("@/components/forms/CreateWorkForm")
);
const PageSelect = dynamic(
    () => import("@/components/complex-elements/PageSelect")
);

export default function WorksPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Experiments");
    // const [initialData, setInitialData] = useState<HookResult<Experiment>>();

    // - Create
    const [createNewOn, setCreateNewOn] = React.useState<boolean>(false);
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
    // - Works
    const {
        mergedExperiments,
        mergedDatasets,
        mergedDataAnalyses,
        mergedAIModels,
        mergedCodeBlocks,
        mergedPapers,
        worksProjects,
    } = useAllUserWorks({
        activeTab: activeTab,
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });


    // Preparing data for display
    let experiments: GeneralInfo[] = [];
    let datasets: GeneralInfo[] = [];
    let dataAnalyses: GeneralInfo[] = [];
    let aiModels: GeneralInfo[] = [];
    let codeBlocks: GeneralInfo[] = [];
    let papers: GeneralInfo[] = [];

    if (mergedExperiments) {
        experiments = transformToWorksInfo(mergedExperiments.data as Work[], worksProjects, "experiments");
    }
    if (mergedDatasets) {
        datasets = transformToWorksInfo(mergedDatasets.data as Work[], worksProjects, "datasets");
    }
    if (mergedDataAnalyses) {
        dataAnalyses = transformToWorksInfo(mergedDataAnalyses.data as Work[], worksProjects, "data_analyses");
    }
    if (mergedAIModels) {
        aiModels = transformToWorksInfo(mergedAIModels.data as Work[], worksProjects, "ai_models");
    }
    if (mergedCodeBlocks) {
        codeBlocks = transformToWorksInfo(mergedCodeBlocks.data as Work[], worksProjects, "code_blocks");
    }
    if (mergedPapers) {
        papers = transformToWorksInfo(mergedPapers.data as Work[], worksProjects, "papers");
    }
    
    // Get refetch based on activeTab
    const getRefetchFunction = () => {
        switch (activeTab) {
            case "Experiments":
                return mergedExperiments.refetch;
            case "Datasets":
                return mergedDatasets.refetch;
            case "Data Analyses":
                return mergedDataAnalyses.refetch;
            case "AI Models":
                return mergedAIModels.refetch;
            case "Code Blocks":
                return mergedCodeBlocks.refetch;
            case "Papers":
                return mergedPapers.refetch;
            default:
                return undefined;
        }
    };

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Works"}
                searchBarPlaceholder="Search works..."
                sortOptions={worksAvailableSearchOptions.availableSortOptions}
                refetch={getRefetchFunction()}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
            />
            <NavigationMenu
                items={worksPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-300 pt-4"
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateWorkForm
                        createNewOn={createNewOn}
                        onCreateNew={onCreateNew}
                    />
                </div>
            )}
            <div className="w-full z-20">
                {activeTab === "Experiments" && (
                    <div>
                        <GeneralList
                            data={experiments || []}
                            columns={["Title", "Users", "Project"]}
                            itemType="Experiments"
                            isLoading={mergedExperiments.isLoading}
                            // disableNumbers={true}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {mergedExperiments.totalCount &&
                                mergedExperiments.totalCount >=
                                    itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            mergedExperiments?.totalCount || 10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Datasets" && (
                    <div>
                        <GeneralList
                            data={datasets || []}
                            columns={["Title", "Users", "Project"]}
                            itemType="Datasets"
                            isLoading={mergedDatasets.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {mergedDatasets.totalCount &&
                                mergedDatasets.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            mergedDatasets?.totalCount || 10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Data Analyses" && (
                    <div>
                        <GeneralList
                            data={dataAnalyses || []}
                            columns={["Title", "Users", "Project"]}
                            itemType="Data Analyses"
                            isLoading={mergedDataAnalyses.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {mergedDataAnalyses.totalCount &&
                                mergedDataAnalyses.totalCount >=
                                    itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            mergedDataAnalyses?.totalCount || 10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "AI Models" && (
                    <div>
                        <GeneralList
                            data={aiModels || []}
                            columns={["Title", "Users", "Project"]}
                            itemType="AI Models"
                            isLoading={mergedAIModels.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {mergedAIModels.totalCount &&
                                mergedAIModels.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            mergedAIModels?.totalCount || 10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Code Blocks" && (
                    <div>
                        <GeneralList
                            data={codeBlocks || []}
                            columns={["Title", "Users", "Project"]}
                            itemType="Code Blocks"
                            isLoading={mergedCodeBlocks.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {mergedCodeBlocks.totalCount &&
                                mergedCodeBlocks.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            mergedCodeBlocks?.totalCount || 10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Papers" && (
                    <div>
                        <GeneralList
                            data={papers || []}
                            columns={["Title", "Users", "Project"]}
                            itemType="Papers"
                            isLoading={mergedPapers.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {mergedPapers.totalCount &&
                                mergedPapers.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            mergedPapers?.totalCount || 10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
