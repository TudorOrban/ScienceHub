"use client";

import { useProject } from "@/contexts/general/ProjectContext";
import { useContext, useEffect, useState } from "react";
import { decodeIdentifier } from "@/utils/functions";
import { OwnershipResult, identifyOwnership } from "@/utils/identifyOwnership";
import { useProjectIdByName } from "@/hooks/utils/useProjectIdByName";
import { ProjectDelta, TextDiff } from "@/types/versionControlTypes";
import TextEditor from "@/version-control-system/components/TextEditor";
import { useTextFieldManager } from "@/version-control-system/hooks/useTextFieldManager";
// import { useVersionControlLogic } from "@/version-control-system/hooks/useVersionControlLogic";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { mergeProjectDeltaIntoProjectData } from "@/version-control-system/mergeProjectDeltaIntoProjectData";
import deepEqual from "fast-deep-equal";
import { CurrentFieldsVersionsContext } from "@/contexts/search-contexts/version-control/CurrentFieldsVersionsContext";
import useProjectGraph from "@/version-control-system/hooks/useProjectGraph";
import useProjectData from "@/hooks/fetch/data-hooks/projects/useProjectDataTest";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
import GeneralBox from "@/components/lists/GeneralBox";
import ProjectPanel from "@/components/complex-elements/sidebars/ProjectPanel";
import { ProjectLayout } from "@/types/projectTypes";
import dynamic from "next/dynamic";
import { transformToSubmissionsInfo } from "@/transforms-to-ui-types/transformToSubmissionsInfo";
import { transformToIssuesInfo } from "@/transforms-to-ui-types/transformToIssuesInfo";
import { transformToReviewsInfo } from "@/transforms-to-ui-types/transformToReviewsInfo";
import { useProjectDataContext } from "@/contexts/project/ProjectDataContext";
import { useProjectEditModeContext } from "@/version-control-system/contexts/ProjectEditModeContext";
import ProjectEditableTextFieldBox from "@/version-control-system/components/ProjectEditableTextFieldBox";
import ProjectMetadataPanel from "@/version-control-system/components/ProjectMetadataPanel";

export default function ProjectOverviewPage({
    params,
}: {
    params: { identifier: string; projectName: string };
}) {
    // Preliminaries
    const { identifier, projectName } = params;

    // States
    const [identifierType, setIdentifierType] = useState<OwnershipResult | null>(null);
    const [projectDelta, setProjectDelta] = useState<ProjectDelta | null>(null);
    const [isProjectDataAvailable, setIsProjectDataAvailable] = useState(false);
    const [isProjectDeltaAvailable, setIsProjectDeltaAvailable] = useState(false);

    // Contexts: supabase, project, userId, editMode and currentFieldsVersions

    const { projectLayout, setProjectLayout, isLoading, setIsLoading } = useProjectDataContext();

    const { setIdentifier, projectName: contextProjectName, setProjectName } = useProject();

    // Contexts
    // - Current user
    const currentUserId = useUserId();

    const {
        isEditModeOn,
        setIsEditModeOn,
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

    // - Project Edit Mode
    // const {
    //     isEditModeOn,
    //     toggleEditMode,
    //     setProjectId,
    //     projectSubmissionId,
    //     setProjectSubmissionId,
    // } = useProjectEditModeContext();

    // const currentFieldsContext = useContext(CurrentFieldsVersionsContext);
    // if (!currentFieldsContext) {
    //     throw new Error(
    //         "CurrentFieldsVersionsContext is undefined, make sure it is provided in component tree"
    //     );
    // }
    // const { description, markFieldAsEdited } = currentFieldsContext;

    // Custom hooks
    // // Load version control
    // const versionControlLogic = useVersionControlLogic(
    //     currentUserId || "794f5523-2fa2-4e22-9f2f-8234ac15829a",
    //     projectId || 1
    // );

    // const { projectGraph, error: projectGraphError } = useProjectGraph(
    //     projectId || 0,
    //     isProjectIdAvailable
    // );
    // const isProjectGraphAvailable = projectGraph !== null;
    // const result = useVersionProjectData(projectGraph || { projectId: projectId?.toString() || "", graphData: {} }, "3", isProjectIdAvailable && isProjectGraphAvailable);

    // console.log("PROJECT Graph: ", projectGraph);
    // console.log("RESULT", result);

    // Effects
    // Decode the identifier from the URL
    useEffect(() => {
        const decodedIdentifier = decodeIdentifier(params.identifier);
        setIdentifier(decodedIdentifier.join("~"));
        setProjectName(projectName.toString());
    }, [params.identifier, params.projectName]);

    // useEffect(() => {
    //     (async () => {
    //         const decodedIdentifier = decodeIdentifier(identifier);
    //         const type = await identifyOwnership(
    //             supabase,
    //             decodedIdentifier.join("~")
    //         );
    //         setIdentifierType(type);
    //     })();
    // }, [identifier]);

    // Version control effects
    // useEffect(() => {
    //     versionControlLogic.setSelectedSubmission(20);
    // }, []);

    // useEffect(() => {
    //     if (isEditModeOn && projectSubmissionId !== null) {
    //         if (!deepEqual(projectDelta, versionControlLogic.projectDelta)) {
    //             setProjectDelta(versionControlLogic.projectDelta);
    //         }
    //     } else {
    //         setProjectDelta(null);
    //     }
    // }, [isEditModeOn, projectSubmissionId, versionControlLogic.projectDelta]);

    // useEffect(() => {
    //     if (projectDelta) {
    //         setIsProjectDeltaAvailable(true);
    //     }
    // }, [projectDelta]);

    // // console.log("EXISTING PROJECT DELTA", projectDelta);

    // // Merge project data and delta
    // const mergedProjectData = projectDelta?.deltaData
    //     ? mergeProjectDeltaIntoProjectData(
    //           projectLayout.data[0] || { id: 0, public: true },
    //           projectDelta.deltaData as unknown as Record<string, TextDiff[]>
    //       )
    //     : projectLayout.data[0];

    // // console.log("MERGED DATA", mergedProjectData?.description);

    // // Set initialFields to the TextFieldManager
    // const initialFields: Record<string, string> = {
    //     description: mergedProjectData?.description || "",
    //     license: mergedProjectData?.license || "",
    // };

    // const { handleFieldUpdate } = useTextFieldManager({
    //     initialFields: initialFields,
    //     isProjectDataAvailable: isProjectDataAvailable,
    //     isProjectDeltaAvailable: isProjectDeltaAvailable,
    // });

    // const layout: ProjectLayout = projectLayout?.data[0];

    // console.log("SASAASAA", layout);
    return (
        <div>
            <div className="flex items-start justify-between flex-wrap lg:flex-nowrap">
                <div className="w-full mr-8">
                    {/* Description */}
                    {(projectLayout.description || isEditModeOn) && (
                        <ProjectEditableTextFieldBox
                            label="Description"
                            fieldKey="description"
                            initialVersionContent={projectLayout?.description || ""}
                            isEditModeOn={isEditModeOn}
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
                    isEditModeOn={isEditModeOn}
                    selectedProjectSubmission={selectedProjectSubmission}
                    projectDeltaChanges={projectDeltaChanges}
                    setProjectDeltaChanges={setProjectDeltaChanges}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
