"use client";

import React, { useState } from "react";
import { worksPageNavigationMenuItems } from "@/config/navItems.config";
import BrowseWorksList from "@/components/lists/works/BrowseWorksList";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import dynamic from "next/dynamic";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { useAdvancedAllWorks } from "@/hooks/fetch/search-hooks/advanced/useAdvancedAllWorks";
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
                            works={mergedExperiments.data || []}
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
                            works={mergedDatasets.data || []}
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
                            works={mergedDataAnalyses.data || []}
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
                            works={mergedAIModels.data || []}
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
                            works={mergedCodeBlocks.data || []}
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
                            works={mergedPapers.data || []}
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
