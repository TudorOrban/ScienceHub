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
import { worksPageNavigationMenuItems } from "@/utils/navItems.config";
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
import { useAdvancedAllWorks } from "@/hooks/fetch/search-hooks/advanced/useAllWorks";
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
            return {
                id: experiment.id,
                workType: "experiments",
                icon: faFlask,
                iconColor: "#2E3A87",
                title: experiment.title,
                createdAt: experiment.createdAt,
                description: experiment.description,
                users: experiment.users,
                link: `/works/experiments/${experiment.id}`,
                public: experiment.public,
            };
        });
    }

    if (mergedDatasets) {
        datasets = mergedDatasets.data.map((dataset: Dataset) => {
            const userIds: string[] = (dataset.users || []).map(
                (user) => user.id
            );
            return {
                id: dataset.id,
                workType: "datasets",
                icon: faDatabase,
                iconColor: "#1A8E34",
                title: dataset.title,
                createdAt: dataset.createdAt,
                description: dataset.description,
                users: dataset.users,
                link: `/works/datasets/${dataset.id}`,
                public: dataset.public,
            };
        });
    }

    if (mergedDataAnalyses) {
        dataAnalyses = mergedDataAnalyses.data.map(
            (dataAnalysis: DataAnalysis) => {
                return {
                    id: dataAnalysis.id,
                    workType: "data_analyses",
                    icon: faChartSimple,
                    iconColor: "#8B2DAE",
                    title: dataAnalysis.title,
                    createdAt: dataAnalysis.createdAt,
                    description: dataAnalysis.description,
                    users: dataAnalysis.users,
                    link: `/works/data-analyses/${dataAnalysis.id}`,
                    public: dataAnalysis.public,
                };
            }
        );
    }

    if (mergedAIModels) {
        aiModels = mergedAIModels.data.map((aiModel: AIModel) => {
            return {
                id: aiModel.id,
                workType: "ai_models",
                icon: faMicrochip,
                iconColor: "#DAA520",
                title: aiModel.title,
                createdAt: aiModel.createdAt,
                description: aiModel.description,
                users: aiModel.users,
                link: `/works/ai-models/${aiModel.id}`,
                public: aiModel.public,
            };
        });
    }

    if (mergedCodeBlocks) {
        codeBlocks = mergedCodeBlocks.data.map((codeBlock: CodeBlock) => {
            return {
                id: codeBlock.id,
                workType: "code_blocks",
                icon: faCode,
                iconColor: "#C82333",
                title: codeBlock.title,
                createdAt: codeBlock.createdAt,
                description: codeBlock.description,
                users: codeBlock.users,
                link: `/works/code-blocks/${codeBlock.id}`,
                public: codeBlock.public,
            };
        });
    }

    if (mergedPapers) {
        papers = mergedPapers.data.map((paper: Paper) => {
            return {
                id: paper.id,
                workType: "papers",
                icon: faClipboard,
                iconColor: "#4A4A4A",
                title: paper.title,
                createdAt: paper.createdAt,
                description: paper.description,
                users: paper.users,
                link: `/works/papers/${paper.id}`,
                public: paper.public,
            };
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
