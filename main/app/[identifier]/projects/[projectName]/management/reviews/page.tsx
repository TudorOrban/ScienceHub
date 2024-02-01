"use client";

import React, { useEffect, useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useProjectIdByName } from "@/hooks/utils/useProjectIdByName";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import WorkspaceTable from "@/components/lists/WorkspaceTable";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { useProjectReviewsSearch } from "@/hooks/fetch/search-hooks/management/useProjectReviewsSearch";
import { GeneralInfo } from "@/types/infoTypes";
import { useWorkReviewsSearch } from "@/hooks/fetch/search-hooks/management/useWorkReviewsSearch";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { reviewsPageNavigationMenuItems } from "@/config/navItems.config";
const CreateReviewForm = dynamic(() => import("@/components/forms/CreateReviewForm"));
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

// Reviews page. To be moved to project-reviews and work-reviews in the future
export default function ReviewsPage({
    params: { identifier, projectName },
}: {
    params: { identifier: string; projectName: string };
}) {
    // States
    const [projectReviews, setProjectReviews] = useState<GeneralInfo[]>([]);
    const [workReviews, setWorkReviews] = useState<GeneralInfo[]>([]);
    const [activeTab, setActiveTab] = useState<string>("Project Reviews");
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);

    // Contexts
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const { data: projectId, error: projectIdError } = useProjectIdByName({
        projectName: projectName,
    });
    const isProjectIdAvailable = !!projectId;

    const projectReviewsData = useProjectReviewsSearch({
        tableFilters: {
            project_id: projectId?.toString() || "0",
        },
        enabled: isProjectIdAvailable,
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const workReviewsData = useWorkReviewsSearch({
        tableFilters: {
            project_id: projectId?.toString() || "0",
        },
        enabled: isProjectIdAvailable,
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    useEffect(() => {
        if (projectReviewsData.status === "success" && projectReviewsData?.data) {
            setProjectReviews(
                projectReviewsData.data.map((review) => ({
                    id: review.id,
                    icon: faFlask,
                    itemType: "project_reviews",
                    title: review.title,
                    createdAt: review.createdAt,
                    description: review.description,
                    link: `/${identifier}/projects/${projectName}/management/project-reviews/${review.id}`,
                    users: review.users,
                    teams: review.teams,
                    public: review.public,
                }))
            );
        }
    }, [projectReviewsData.data]);

    useEffect(() => {
        if (workReviewsData.status === "success" && workReviewsData?.data) {
            setWorkReviews(
                workReviewsData.data.map((review) => ({
                    id: review.id,
                    icon: faFlask,
                    itemType: "work_reviews",
                    title: review.title,
                    createdAt: review.createdAt,
                    description: review.description,
                    link: `/${identifier}/projects/${projectName}/management/work-reviews/${review.id}`,
                    users: review.users,
                    teams: review.teams,
                    public: review.public,
                }))
            );
        }
    }, [workReviewsData.data]);

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Project Reviews"}
                searchBarPlaceholder="Search reviews..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
                searchContext="Project General"
            />
            <NavigationMenu
                items={reviewsPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            {activeTab === "Project Reviews" && (
                <div>
                    <WorkspaceTable
                        data={projectReviews || []}
                        isLoading={projectReviewsData.isLoading}
                        isSuccess={projectReviewsData.status === "success"}
                        itemType="project_reviews"
                    />
                    <div className="flex justify-end my-4 mr-4">
                        {projectReviewsData.data.length &&
                            projectReviewsData.data.length >= itemsPerPage && (
                                <PageSelect
                                    numberOfElements={projectReviewsData.data.length}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                    </div>
                </div>
            )}
            {activeTab === "Work Reviews" && (
                <div>
                    <WorkspaceTable
                        data={workReviews || []}
                        isLoading={workReviewsData.isLoading}
                        isSuccess={workReviewsData.status === "success"}
                        itemType="work_reviews"
                    />
                    <div className="flex justify-end my-4 mr-4">
                        {workReviewsData.data.length &&
                            workReviewsData.data.length >= itemsPerPage && (
                                <PageSelect
                                    numberOfElements={workReviewsData.data.length}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                    </div>
                </div>
            )}

            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateReviewForm
                        initialValues={{
                            initialReviewObjectType: "Project",
                            initialProjectId: projectId,
                        }}
                        onCreateNew={() => setCreateNewOn(!createNewOn)}
                    />
                </div>
            )}
        </div>
    );
}
