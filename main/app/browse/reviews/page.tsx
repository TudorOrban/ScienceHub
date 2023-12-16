"use client";

import React, { useState } from "react";
import { reviewsPageNavigationMenuItems } from "@/config/navItems.config";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { GeneralInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import GeneralList from "@/components/lists/GeneralList";
import { useAllReviewsAdvanced } from "@/hooks/fetch/search-hooks/advanced/useAllReviewsAdvanced";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function ReviewsPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Project Reviews");
    

    // Contexts
    // - Select page
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
    const itemsPerPage = 20;


    // Custom Hooks
    const {
        projectReviewsData,
        workReviewsData,
        projectReviewsLoading,
        workReviewsLoading,
    } = useAllReviewsAdvanced({
        activeTab: activeTab,
        page: selectedPage,
        itemsPerPage: itemsPerPage,
        context: "Browse Reviews"
    });


    // Getting data ready for display
    let projectReviews,
        workReviews: GeneralInfo[] = [];

    if (projectReviewsData?.data) {
        projectReviews = projectReviewsData.data.map(
            (projectReview) => ({
                id: projectReview.id,
                itemType: "reviews",
                icon: faFlask,
                title: projectReview.title,
                createdAt: projectReview.createdAt,
                description: projectReview.description,
                users: projectReview.users,
                link: `/management/reviews/${projectReview.id}`,
                public: projectReview.public,
            })
        );
    }

    if (workReviewsData?.data) {
        workReviews = workReviewsData.data.map(
            (workReview) => ({
                id: workReview.id,
                itemType: "work_reviews",
                icon: faFlask,
                title: workReview.title,
                createdAt: workReview.createdAt,
                description: workReview.description,
                users: workReview.users,
                link: `/management/reviews/${workReview.id}`,
                public: workReview.public,
            })
        );
    }

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
                        <div>
                            <GeneralList
                                data={projectReviews || []}
                                isLoading={projectReviewsData.isLoading}
                            />
                        </div>
                        <div className="flex justify-end my-4 mr-4">
                            {projectReviewsData.totalCount &&
                                projectReviewsData.totalCount >=
                                    itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            projectReviewsData?.totalCount ||
                                            10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Work Reviews" && (
                    <div>
                        <div>
                            <GeneralList
                                data={workReviews}
                                isLoading={workReviewsData.isLoading}
                            />
                        </div>
                        <div className="flex justify-end my-4 mr-4">
                            {workReviewsData.totalCount &&
                                workReviewsData.totalCount >=
                                    itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            workReviewsData?.totalCount || 10
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
