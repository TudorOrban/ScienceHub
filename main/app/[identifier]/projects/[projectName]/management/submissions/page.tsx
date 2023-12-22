"use client";

import React, { useEffect, useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { submissionsPageNavigationMenuItems } from "@/config/navItems.config";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { GeneralInfo } from "@/types/infoTypes";
import { useProjectIdByName } from "@/hooks/utils/useProjectIdByName";
import { useProjectSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import { useWorkSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useWorkSubmissionsSearch";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import GeneralList from "@/components/lists/GeneralList";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { useProjectMediumData } from "@/hooks/fetch/data-hooks/projects/useProjectSmallData";
import PageSelect from "@/components/complex-elements/PageSelect";
const CreateSubmissionForm = dynamic(() => import("@/components/forms/CreateSubmissionForm"));

export default function SubmissionsPage({ params }: { params: { projectName: string } }) {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Project Submissions");
    const [projectSubmissions, setProjectSubmissions] = useState<GeneralInfo[]>([]);
    const [workSubmissions, setWorkSubmissions] = useState<GeneralInfo[]>([]);

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

    const projectMediumData = useProjectMediumData(projectId || 0, !!projectId);

    const projectSubmissionsData = useProjectSubmissionsSearch({
        extraFilters: { project_id: projectId },
        enabled: !!projectId && activeTab === "Project Submissions",
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const workSubmissionsData = useWorkSubmissionsSearch({
        extraFilters: { project_id: projectId },
        enabled: !!projectId && activeTab === "Work Submissions",
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    useEffect(() => {
        if (projectSubmissionsData.status === "success" && projectSubmissionsData?.data) {
            const submissions = projectSubmissionsData.data.map((projectSubmission) => ({
                id: projectSubmission.id,
                icon: faFlask,
                itemType: "project_submissions",
                title: projectSubmission.title,
                createdAt: projectSubmission.createdAt,
                description: projectSubmission.description,
                users: projectSubmission.users,
                public: projectSubmission.public,
            }));
            setProjectSubmissions(submissions);
        }
    }, [projectSubmissionsData.data]);

    useEffect(() => {
        if (workSubmissionsData.status === "success" && workSubmissionsData?.data) {
            setWorkSubmissions(
                workSubmissionsData.data.map((workSubmission) => ({
                    id: workSubmission.id,
                    icon: faFlask,
                    itemType: "work_submissions",
                    title: workSubmission.title,
                    createdAt: workSubmission.createdAt,
                    description: workSubmission.description,
                    users: workSubmission.users,
                    public: workSubmission.public,
                }))
            );
        }
    }, [workSubmissionsData.data]);

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
                    <CreateSubmissionForm
                        initialSubmissionObjectType={"Project"}
                        initialProjectId={projectId?.toString()}
                        currentProjectVersionId={projectMediumData.data[0].currentProjectVersionId?.toString()}
                        onCreateNew={onCreateNew}
                    />
                </div>
            )}
            {activeTab === "Project Submissions" && (
                <div>
                    <GeneralList
                        columns={["Title", "Users"]}
                        data={projectSubmissions || []}
                        isLoading={projectSubmissionsData.isLoading}
                        isSuccess={projectSubmissionsData.status === "success"}
                        shouldPush={true}
                    />
                    <div className="flex justify-end my-4 mr-4">
                        {projectSubmissionsData.totalCount &&
                            projectSubmissionsData.totalCount >= itemsPerPage && (
                                <PageSelect
                                    numberOfElements={projectSubmissionsData?.totalCount || 10}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                    </div>
                </div>
            )}
            {activeTab === "Work Submissions" && (
                <GeneralList
                    columns={["Title", "Users"]}
                    data={workSubmissions}
                    isLoading={workSubmissionsData.isLoading}
                    isSuccess={workSubmissionsData.status === "success"}
                    shouldPush={true}
                />
            )}
        </div>
    );
}
