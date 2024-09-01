"use client";

import React, { useEffect, useState } from "react";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useProjectIdByName } from "@/src/hooks/utils/useProjectIdByName";
import { useDeleteModeContext } from "@/src/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import WorkspaceTable from "@/src/components/lists/WorkspaceTable";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import { GeneralInfo } from "@/src/types/infoTypes";
import { useWorkReviewsSearch } from "@/src/hooks/fetch/search-hooks/management/useWorkReviewsSearch";
import NavigationMenu from "@/src/components/headers/NavigationMenu";
import { reviewsPageNavigationMenuItems } from "@/src/config/navItems.config";
import { useSearchProjectReviews } from "@/src/hooks/fetch/search-hooks/management/useSearchProjectReviews";
const CreateReviewForm = dynamic(() => import("@/src/components/forms/CreateReviewForm"));
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));

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
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const { data: projectId, error: projectIdError } = useProjectIdByName({
        projectName: projectName,
    });
    const isProjectIdAvailable = !!projectId;

    const projectReviewsData = useSearchProjectReviews({
        entityId: projectId?.toString() ?? "0",
        enabled: isProjectIdAvailable,
        sortBy: "createdAt",
        sortDescending: true,
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const workReviewsData = useWorkReviewsSearch({
        tableFilters: {
            project_id: projectId?.toString() ?? "0",
        },
        enabled: isProjectIdAvailable,
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    useEffect(() => {
        if (projectReviewsData.isLoading === false && projectReviewsData.error === undefined && projectReviewsData?.data) {
            setProjectReviews(
                projectReviewsData.data.results.map((review) => ({
                    id: review.id,
                    icon: faFlask,
                    itemType: "project_reviews",
                    title: review.title,
                    createdAt: review.createdAt,
                    description: review.description,
                    link: `/${identifier}/projects/${projectName}/management/project-reviews/${review.id}`,
                    users: review.projectReviewUsers?.map((user) => user.user ?? { id: "", username: "", fullName: "" }) ?? [],
                    teams: []
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
                        data={projectReviews ?? []}
                        isLoading={projectReviewsData.isLoading}
                        isSuccess={projectReviewsData.error === undefined && !projectReviewsData.isLoading}
                        itemType="project_reviews"
                    />
                    <div className="flex justify-end my-4 mr-4">
                        {!!projectReviewsData.data.results.length &&
                            projectReviewsData.data.results.length >= itemsPerPage && (
                                <PageSelect
                                    numberOfElements={projectReviewsData.data.results.length}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                    </div>
                </div>
            )}
            {activeTab === "Work Reviews" && (
                <div>
                    <WorkspaceTable
                        data={workReviews ?? []}
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
