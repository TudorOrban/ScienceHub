"use client";

import React, { useEffect, useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { GeneralInfo } from "@/types/infoTypes";
import { useProjectIdByName } from "@/hooks/utils/useProjectIdByName";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import GeneralList from "@/components/lists/GeneralList";
import dynamic from "next/dynamic";
import { useReviewsSearch } from "@/hooks/fetch/search-hooks/management/useReviewsSearch";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { Review } from "@/types/managementTypes";
import PageSelect from "@/components/complex-elements/PageSelect";
const CreateReviewForm = dynamic(() => import("@/components/forms/CreateReviewForm"));

export default function ReviewsPage({ params }: { params: { projectName: string } }) {
    // States
    // - Data
    const [reviews, setReviews] = useState<Review[]>([]);

    // - Create
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);
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
    const { data: projectId, error: projectIdError } = useProjectIdByName({
        projectName: params.projectName,
    });
    const projectReviewsData = useReviewsSearch({
        tableFilters: {
            object_type: "Project",
            object_id: projectId,
        },
        enabled: !!projectId,
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    useEffect(() => {
        if (projectReviewsData.status === "success" && !!projectReviewsData?.data) {
            setReviews(
                projectReviewsData.data.map((review) => ({
                    id: review.id,
                    icon: faFlask,
                    itemType: "reviews",
                    title: review.title,
                    createdAt: review.createdAt,
                    description: review.description,
                    users: [],
                    public: review.public,
                }))
            );
        }
    }, [projectReviewsData.data]);

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Project Reviews"}
                searchBarPlaceholder="Search reviews..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
                searchContext="Project General"
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateReviewForm
                        initialValues={{
                            initialReviewType: "Community Review",
                            initialReviewObjectType: "Project",
                            initialProjectId: projectId?.toString(),
                        }}
                        onCreateNew={onCreateNew}
                    />
                </div>
            )}
            <div>
                <GeneralList
                    data={reviews || []}
                    isLoading={projectReviewsData.isLoading}
                    isSuccess={projectReviewsData.status === "success"}
                    itemType="reviews"
                    shouldPush={true}
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
        </div>
    );
}
