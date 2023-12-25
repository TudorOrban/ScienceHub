"use client";

import { useEffect } from "react";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useProjectDataContext } from "@/contexts/project/ProjectDataContext";
import { useProjectEditModeContext } from "@/version-control-system/contexts/ProjectEditModeContext";
import ProjectEditableTextFieldBox from "@/version-control-system/components/ProjectEditableTextFieldBox";
import ProjectMetadataPanel from "@/version-control-system/components/ProjectMetadataPanel";

export default function ProjectOverviewPage({
    params: { identifier, projectName },
}: {
    params: { identifier: string; projectName: string };
}) {
    // Contexts
    // - Project (small) data
    const { projectLayout, setProjectLayout, isLoading, setIsLoading } = useProjectDataContext();

    // - Current user
    const currentUserId = useUserId();

    // - Project Edit mode
    const {
        isProjectEditModeOn,
        setIsProjectEditModeOn,
        setProjectId,
        setProjectName: setProjectNameEditMode,
        selectedProjectSubmission,
        selectedProjectSubmissionRefetch,
        projectDeltaChanges,
        setProjectDeltaChanges,
    } = useProjectEditModeContext();

    useEffect(() => {
        setProjectId(projectLayout?.id);
        setProjectNameEditMode(projectName);
    }, []);

    return (
        <div>
            <div className="flex items-start justify-between flex-wrap lg:flex-nowrap">
                <div className="w-full mr-8">
                    {/* Description */}
                    {(projectLayout.description || isProjectEditModeOn) && (
                        <ProjectEditableTextFieldBox
                            label="Description"
                            fieldKey="description"
                            initialVersionContent={projectLayout?.description || ""}
                            isEditModeOn={isProjectEditModeOn}
                            selectedProjectSubmission={selectedProjectSubmission}
                            projectDeltaChanges={projectDeltaChanges}
                            setProjectDeltaChanges={setProjectDeltaChanges}
                            isLoading={isLoading}
                            className="w-full m-4"
                        />
                    )}
                </div>

                <ProjectMetadataPanel
                    metadata={{
                        // doi: "",
                        license: projectLayout?.projectMetadata?.license,
                        publisher: projectLayout?.projectMetadata?.publisher,
                        conference: projectLayout?.projectMetadata?.conference,
                        researchGrants: projectLayout?.projectMetadata?.researchGrants || [],
                        tags: projectLayout?.projectMetadata?.tags,
                        keywords: projectLayout?.projectMetadata?.keywords,
                    }}
                    isEditModeOn={isProjectEditModeOn}
                    selectedProjectSubmission={selectedProjectSubmission}
                    projectDeltaChanges={projectDeltaChanges}
                    setProjectDeltaChanges={setProjectDeltaChanges}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
