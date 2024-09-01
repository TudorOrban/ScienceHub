"use client";

import { useEffect } from "react";
import { useProjectDataContext } from "@/src/contexts/project/ProjectDataContext";
import { useProjectEditModeContext } from "@/src/modules/version-control-system/contexts/ProjectEditModeContext";
import ProjectEditableTextFieldBox from "@/src/modules/version-control-system/components/ProjectEditableTextFieldBox";
import ProjectMetadataPanel from "@/src/modules/version-control-system/components/ProjectMetadataPanel";

// The main page for a project.
export default function ProjectOverviewPage({
    params: { identifier, projectName },
}: {
    params: { identifier: string; projectName: string };
}) {
    // Contexts
    const { projectLayout, setProjectLayout, isLoading, setIsLoading } = useProjectDataContext();
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
    
    // Initialize edit mode
    useEffect(() => {
        setProjectId(projectLayout?.id);
        setProjectNameEditMode(projectName);
    }, []);

    return (
        <div className="w-full flex items-start justify-between flex-wrap lg:flex-nowrap overflow-x-hidden">
            <div className="m-4">
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
                        className="w-full"
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
    );
}
