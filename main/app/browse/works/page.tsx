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
import BrowseWorksList from "@/components/lists/works/BrowseWorksList";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { WorkInfo } from "@/types/infoTypes";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import dynamic from "next/dynamic";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { useAdvancedAllWorks } from "@/hooks/fetch/search-hooks/advanced/useAdvancedAllWorks";
import { transformWorkToWorkInfo } from "@/transforms-to-ui-types/transformWorkToWorkInfo";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function WorksPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Papers");
    
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
                        <BrowseWorksList
                            data={experiments || []}
                            isLoading={mergedExperiments.isLoading}
                            isSuccess={mergedExperiments.status === "success"}
                            workType="Experiment"
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
                        <BrowseWorksList
                            data={datasets || []}
                            isLoading={mergedDatasets.isLoading}
                            isSuccess={mergedDatasets.status === "success"}
                            workType="Dataset"
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
                        <BrowseWorksList
                            data={dataAnalyses || []}
                            isLoading={mergedDataAnalyses.isLoading}
                            isSuccess={mergedDataAnalyses.status === "success"}
                            workType="Data Analysis"
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
                        <BrowseWorksList
                            data={aiModels || []}
                            isLoading={mergedAIModels.isLoading}
                            isSuccess={mergedAIModels.status === "success"}
                            workType="AI Model"
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
                        <BrowseWorksList
                            data={codeBlocks || []}
                            isLoading={mergedCodeBlocks.isLoading}
                            isSuccess={mergedCodeBlocks.status === "success"}
                            workType="Code Block"
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
                        <BrowseWorksList
                            data={papers || []}
                            isLoading={mergedPapers.isLoading}
                            isSuccess={mergedPapers.status === "success"}
                            workType="Paper"
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
