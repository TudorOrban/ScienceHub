"use client";

import React, { useEffect, useState } from "react";
import { reviewsPageNavigationMenuItems } from "@/src/config/navItems.config";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import NavigationMenu from "@/src/components/headers/NavigationMenu";
import { GeneralInfo } from "@/src/types/infoTypes";
import dynamic from "next/dynamic";
import BrowseHeaderUI from "@/src/components/headers/BrowseHeaderUI";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import WorkspaceTable from "@/src/components/lists/WorkspaceTable";
import { useAllReviewsAdvanced } from "@/src/hooks/fetch/search-hooks/advanced/useAllReviewsAdvanced";
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));

export default function ReviewsPage() {
    // States
    const [projectReviews, setProjectReviews] = useState<GeneralInfo[]>([]);
    const [workReviews, setWorkReviews] = useState<GeneralInfo[]>([]);
    const [activeTab, setActiveTab] = useState<string>("Project Reviews");

    // Contexts
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const { projectReviewsData, workReviewsData, projectReviewsLoading, workReviewsLoading } =
        useAllReviewsAdvanced({
            activeTab: activeTab,
            page: selectedPage,
            itemsPerPage: itemsPerPage,
            context: "Browse Reviews",
        });

    // Getting data ready for display
    useEffect(() => {
        if (projectReviewsData.status === "success" && projectReviewsData?.data) {
            setProjectReviews(
                projectReviewsData.data.map((projectReview) => ({
                    id: projectReview.id,
                    itemType: "reviews",
                    icon: faFlask,
                    title: projectReview.title,
                    createdAt: projectReview.createdAt,
                    description: projectReview.description,
                    users: projectReview.users,
                    link: `/management/reviews/${projectReview.id}`,
                    public: projectReview.public,
                }))
            );
        }
    }, [projectReviewsData.data]);

    useEffect(() => {
        if (workReviewsData.status === "success" && workReviewsData?.data) {
            setWorkReviews(
                workReviewsData.data.map((workReview) => ({
                    id: workReview.id,
                    itemType: "work_reviews",
                    icon: faFlask,
                    title: workReview.title,
                    createdAt: workReview.createdAt,
                    description: workReview.description,
                    users: workReview.users,
                    link: `/management/reviews/${workReview.id}`,
                    public: workReview.public,
                }))
            );
        }
    }, [workReviewsData.data]);

    return (
        <div className="">
            <BrowseHeaderUI
                title={"Browse Reviews"}
                searchBarPlaceholder="Search reviews..."
                context="Browse Reviews"
            />
            <NavigationMenu
                items={reviewsPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            <div className="w-full">
                {activeTab === "Project Reviews" && (
                    <div>
                        <WorkspaceTable
                            data={projectReviews || []}
                            isLoading={projectReviewsData.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {projectReviewsData.totalCount &&
                                projectReviewsData.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={projectReviewsData?.totalCount || 10}
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Work Reviews" && (
                    <div>
                        <WorkspaceTable data={workReviews} isLoading={workReviewsData.isLoading} />
                        <div className="flex justify-end my-4 mr-4">
                            {workReviewsData.totalCount &&
                                workReviewsData.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={workReviewsData?.totalCount || 10}
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
