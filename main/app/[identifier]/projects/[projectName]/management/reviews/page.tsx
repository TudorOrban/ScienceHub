"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useUserId } from "@/app/contexts/general/UserIdContext";
import { GeneralInfo } from "@/types/infoTypes";
import { useProjectIdByName } from "@/app/hooks/utils/useProjectIdByName";
import { useDeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/app/contexts/general/PageSelectContext";
import GeneralList from "@/components/lists/GeneralList";
import dynamic from "next/dynamic";
import { useReviewsSearch } from "@/app/hooks/fetch/search-hooks/management/useReviewsSearch";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
const CreateReviewForm = dynamic(
    () => import("@/components/forms/CreateReviewForm")
);

export default function IssuesPage({
    params,
}: {
    params: { projectName: string };
}) {
    // States
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
    const isProjectIdAvailable = projectId != null && !isNaN(Number(projectId));

    const projectReviewsData = useReviewsSearch({
        tableFilters: {
            object_type: "Project",
            object_id: projectId?.toString() || "1",
        },
        enabled: isProjectIdAvailable,
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });


    // Getting data ready for display
    let reviews: GeneralInfo[] = [];

    if (projectReviewsData?.data) {
        reviews = projectReviewsData.data.map((review) => ({
            id: review.id,
            icon: faFlask,
            itemType: "reviews",
            title: review.title,
            createdAt: review.createdAt,
            description: review.description,
            users: [],
            public: review.public,
        }));
    }

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
                    {/* <div className="bg-white rounded"> */}
                    {isProjectIdAvailable ? (
                        <CreateReviewForm
                            initialValues={{
                                initialReviewType: "Community Review",
                                initialReviewObjectType: "Project",
                                initialProjectId: projectId?.toString(),
                            }}
                            onCreateNew={onCreateNew}
                        />
                    ) : (
                        <CreateReviewForm
                            initialValues={{}}
                            onCreateNew={onCreateNew}
                        />
                    )}
                    {/* </div> */}
                </div>
            )}
            <div className="w-full">
                <div>
                    <GeneralList
                        data={reviews || []}
                        isLoading={projectReviewsData.isLoading}
                        shouldPush={true}
                    />
                </div>
            </div>
        </div>
    );
}
