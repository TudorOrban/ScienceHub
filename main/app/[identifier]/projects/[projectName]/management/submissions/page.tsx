"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { submissionsPageNavigationMenuItems } from "@/utils/navItems.config";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useUserId } from "@/app/contexts/general/UserIdContext";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { GeneralInfo } from "@/types/infoTypes";
import { useProjectIdByName } from "@/app/hooks/utils/useProjectIdByName";
import { useProjectSubmissionsSearch } from "@/app/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import { useWorkSubmissionsSearch } from "@/app/hooks/fetch/search-hooks/submissions/useWorkSubmissionsSearch";
import { useDeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/app/contexts/general/PageSelectContext";
import GeneralList from "@/components/lists/GeneralList";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
const CreateSubmissionForm = dynamic(() => import("@/components/forms/CreateSubmissionForm"));

export default function SubmissionsPage({
    params,
}: {
    params: { projectName: string };
}) {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Project Submissions");
    
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

    const projectSubmissionsData = useProjectSubmissionsSearch({
        extraFilters: { projects: projectId?.toString() || "0" },
        enabled: isProjectIdAvailable && activeTab === "Project Submissions",
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const workSubmissionsData = useWorkSubmissionsSearch({
        extraFilters: { projects: projectId?.toString() || "0"},
        enabled: isProjectIdAvailable && activeTab === "Work Submissions",
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const currentProjectVersionId = "21";

    
    // Getting data ready for display
    let projectSubmissions,
        workSubmissions: GeneralInfo[] = [];

    if (projectSubmissionsData?.data) {
        projectSubmissions = projectSubmissionsData.data.map(
            (projectSubmission) => ({
                id: projectSubmission.id,
                icon: faFlask,
                itemType: "project_submissions",
                title: projectSubmission.title,
                createdAt: projectSubmission.createdAt,
                description: projectSubmission.description,
                users: [],
                public: projectSubmission.public,
            })
        );
    }

    if (workSubmissionsData?.data) {
        workSubmissions = workSubmissionsData.data.map(
            (workSubmission) => ({
                id: workSubmission.id,
                icon: faFlask,
                itemType: "work_submissions",
                title: workSubmission.title,
                createdAt: workSubmission.createdAt,
                description: workSubmission.description,
                users: [],
                public: workSubmission.public,
            })
        );
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Submissions"}
                searchBarPlaceholder="Search submissions..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
                searchContext="Project General"
            />
            <NavigationMenu
                items={submissionsPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    {/* <div className="bg-white rounded"> */}
                    {isProjectIdAvailable ? (
                        <CreateSubmissionForm
                            initialSubmissionObjectType={"Project"}
                            initialProjectId={projectId?.toString()}
                            currentProjectVersionId={currentProjectVersionId}
                            onCreateNew={onCreateNew}
                        />
                    ) : (
                        <CreateSubmissionForm
                            currentProjectVersionId={currentProjectVersionId}
                            onCreateNew={onCreateNew}
                        />
                    )}
                    {/* </div> */}
                </div>
            )}
            <div className="w-full">
                {activeTab === "Project Submissions" && (
                    <div>
                        <GeneralList
                            data={projectSubmissions || []}
                            isLoading={projectSubmissionsData.isLoading}
                            shouldPush={true}
                        />
                    </div>
                )}
                {activeTab === "Work Submissions" && (
                    <div>
                        <GeneralList
                            data={workSubmissions}
                            isLoading={projectSubmissionsData.isLoading}
                            shouldPush={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
