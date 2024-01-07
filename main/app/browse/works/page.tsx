"use client";

import React, { useState } from "react";
import {
    AIModel,
    CodeBlock,
    DataAnalysis,
    Dataset,
    Experiment,
    Paper,
} from "@/types/workTypes";
import { worksPageNavigationMenuItems } from "@/config/navItems.config";
import {
    faChartSimple,
    faClipboard,
    faCode,
    faDatabase,
    faFlask,
    faMicrochip,
} from "@fortawesome/free-solid-svg-icons";
import WorksList from "@/components/lists/works/WorksList";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { WorkInfo } from "@/types/infoTypes";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import dynamic from "next/dynamic";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { useAdvancedAllWorks } from "@/hooks/fetch/search-hooks/advanced/useAdvancedAllWorks";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
import { transformWorkToWorkInfo } from "@/transforms-to-ui-types/transformWorkToWorkInfo";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function WorksPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Experiments");
    
    // Contexts
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
        experimentsLoading,
        datasetsLoading,
        dataAnalysesLoading,
        aiModelsLoading,
        codeBlocksLoading,
        papersLoading,
    } = useAdvancedAllWorks({
        activeTab: activeTab,
        page: selectedPage,
        itemsPerPage: itemsPerPage,
        context: "Browse Works"
    });

    // Preparing data for display
    let experiments,
        datasets,
        dataAnalyses,
        aiModels,
        codeBlocks,
        papers: WorkInfo[] = [];

    if (mergedExperiments) {
        experiments = mergedExperiments.data.map((experiment: Experiment) => {
            return transformWorkToWorkInfo(experiment, experiment?.projects?.[0]);
        });
    }

    if (mergedDatasets) {
        datasets = mergedDatasets.data.map((dataset: Dataset) => {
            return transformWorkToWorkInfo(dataset, dataset?.projects?.[0]);
        });
    }

    if (mergedDataAnalyses) {
        dataAnalyses = mergedDataAnalyses.data.map(
            (dataAnalysis: DataAnalysis) => {
                return transformWorkToWorkInfo(dataAnalysis, dataAnalysis?.projects?.[0]);
            }
        );
    }

    if (mergedAIModels) {
        aiModels = mergedAIModels.data.map((aiModel: AIModel) => {
            return transformWorkToWorkInfo(aiModel, aiModel?.projects?.[0]);
        });
    }

    if (mergedCodeBlocks) {
        codeBlocks = mergedCodeBlocks.data.map((codeBlock: CodeBlock) => {
            return transformWorkToWorkInfo(codeBlock, codeBlock?.projects?.[0]);
        });
    }

    if (mergedPapers) {
        papers = mergedPapers.data.map((paper: Paper) => {
            return transformWorkToWorkInfo(paper, paper?.projects?.[0]);
        });
    }

    return (
        <div>
            <BrowseHeaderUI
                title={"Browse Works"}
                searchBarPlaceholder="Search works..."
                context="Browse Works"
            />
            <NavigationMenu
                items={worksPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            <div className="w-full">
                {activeTab === "Experiments" && (
                    <div>
                        <WorksList
                            data={experiments || []}
                            isLoading={experimentsLoading}
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
                        <WorksList
                            data={datasets || []}
                            isLoading={datasetsLoading}
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
                        <WorksList
                            data={dataAnalyses || []}
                            isLoading={dataAnalysesLoading}
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
                        <WorksList
                            data={aiModels || []}
                            isLoading={aiModelsLoading}
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
                        <WorksList
                            data={codeBlocks || []}
                            isLoading={codeBlocksLoading}
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
                        <WorksList
                            data={papers || []}
                            isLoading={papersLoading}
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

                {/* <Button onClick={() => handleDeleteWork(1, "experiments", "P")}>Delete Work</Button> */}
            </div>
        </div>
    );
}
