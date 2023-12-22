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
import { useIssuesSearch } from "@/hooks/fetch/search-hooks/management/useIssuesSearch";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { Issue } from "@/types/managementTypes";
const CreateIssueForm = dynamic(() => import("@/components/forms/CreateIssueForm"));

export default function IssuesPage({ params }: { params: { projectName: string } }) {
    // States
    // - Data
    const [issues, setIssues] = useState<Issue[]>([]);

    // - Create
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);
    const onCreateNew = () => {
        setCreateNewOn(!createNewOn);
    };

    // Contexts
    // - Current user
    const currentUserId = useUserId();
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

    const projectIssuesData = useIssuesSearch({
        tableFilters: {
            object_type: "Project",
            object_id: projectId?.toString() || "0",
        },
        enabled: isProjectIdAvailable,
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    useEffect(() => {
        if (projectIssuesData.status === "success" && projectIssuesData?.data) {
            setIssues(
                projectIssuesData.data.map((issue) => ({
                    id: issue.id,
                    icon: faFlask,
                    itemType: "issues",
                    title: issue.title,
                    createdAt: issue.createdAt,
                    description: issue.description,
                    users: [],
                    public: issue.public,
                }))
            );
        }
    }, [projectIssuesData.data]);

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Project Issues"}
                searchBarPlaceholder="Search issues..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
                searchContext="Project General"
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateIssueForm
                        initialValues={{
                            initialIssueObjectType: "Project",
                            initialProjectId: projectId?.toString(),
                        }}
                        onCreateNew={onCreateNew}
                    />
                </div>
            )}
            <GeneralList
                data={issues || []}
                isLoading={projectIssuesData.isLoading}
                isSuccess={projectIssuesData.status === "success"}
                itemType="issues"
                shouldPush={true}
            />
        </div>
    );
}
