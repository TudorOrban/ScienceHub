"use client";

import React, { useEffect, useState } from "react";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import { submissionsPageNavigationMenuItems } from "@/src/config/navItems.config";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import NavigationMenu from "@/src/components/headers/NavigationMenu";
import { GeneralInfo } from "@/src/types/infoTypes";
import { useProjectIdByName } from "@/src/hooks/utils/useProjectIdByName";
import { useProjectSubmissionsSearch } from "@/src/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import { useWorkSubmissionsSearch } from "@/src/hooks/fetch/search-hooks/submissions/useWorkSubmissionsSearch";
import { useDeleteModeContext } from "@/src/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import WorkspaceTable from "@/src/components/lists/WorkspaceTable";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import { useProjectMediumData } from "@/src/hooks/fetch/data-hooks/projects/useProjectSmallData";
import PageSelect from "@/src/components/complex-elements/PageSelect";
const CreateSubmissionForm = dynamic(() => import("@/src/components/forms/CreateSubmissionForm"));

// Issues page. To be moved to project-issues and work-issues in the future
export default function SubmissionsPage({
    params: { identifier, projectName },
}: {
    params: { identifier: string; projectName: string };
}) {
    // States
    const [projectSubmissions, setProjectSubmissions] = useState<GeneralInfo[]>([]);
    const [workSubmissions, setWorkSubmissions] = useState<GeneralInfo[]>([]);
    const [activeTab, setActiveTab] = useState<string>("Project Submissions");
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);

    // Contexts
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const { data: projectId, error: projectIdError } = useProjectIdByName({
        projectName: projectName,
    });
1
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
                link: `/${identifier}/projects/${projectName}/management/project-submissions/${projectSubmission.id}`,
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
                    link: `/${identifier}/management/work-submissions/${workSubmission.id}`,
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
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
                searchContext="Project General"
            />
            <NavigationMenu
                items={submissionsPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            {activeTab === "Project Submissions" && (
                <div>
                    <WorkspaceTable
                        columns={["Title", "Users"]}
                        data={projectSubmissions || []}
                        isLoading={projectSubmissionsData.isLoading}
                        isSuccess={projectSubmissionsData.status === "success"}
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
                <WorkspaceTable
                    columns={["Title", "Users"]}
                    data={workSubmissions}
                    isLoading={workSubmissionsData.isLoading}
                    isSuccess={workSubmissionsData.status === "success"}
                />
            )}

            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateSubmissionForm
                        initialSubmissionObjectType={"Project"}
                        initialProjectId={projectId}
                        currentProjectVersionId={projectMediumData.data[0].currentProjectVersionId}
                        onCreateNew={() => setCreateNewOn(!createNewOn)}
                    />
                </div>
            )}
        </div>
    );
}
