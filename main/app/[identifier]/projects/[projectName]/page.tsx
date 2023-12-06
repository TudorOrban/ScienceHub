"use client";

import { useProject } from "@/app/contexts/general/ProjectContext";
import { useContext, useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { decodeIdentifier } from "@/utils/functions";
import { OwnershipResult, identifyOwnership } from "@/utils/identifyOwnership";
import { useProjectIdByName } from "@/app/hooks/utils/useProjectIdByName";
import { useProjectEditModeContext } from "@/app/contexts/search-contexts/version-control/ProjectEditModeContext";
import { ProjectDelta, TextDiff } from "@/types/versionControlTypes";
import TextEditor from "@/app/version-control-system/components/TextEditor";
import { useTextFieldManager } from "@/app/version-control-system/hooks/useTextFieldManager";
// import { useVersionControlLogic } from "@/app/version-control-system/hooks/useVersionControlLogic";
import { useUserId } from "@/app/contexts/current-user/UserIdContext";
import { mergeProjectDeltaIntoProjectData } from "@/app/version-control-system/mergeProjectDeltaIntoProjectData";
import deepEqual from "fast-deep-equal";
import { CurrentFieldsVersionsContext } from "@/app/contexts/search-contexts/version-control/CurrentFieldsVersionsContext";
import useProjectGraph from "@/app/version-control-system/hooks/useProjectGraph";
import { MultiWorks } from "@/components/lists/WorksMultiBox";
import useProjectData from "@/app/hooks/fetch/data-hooks/projects/useProjectDataTest";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
import GeneralBox from "@/components/lists/GeneralBox";
import ProjectPanel from "@/components/complex-elements/sidebars/ProjectPanel";
import { ProjectLayout } from "@/types/projectTypes";
import dynamic from "next/dynamic";
import { transformToSubmissionsInfo } from "@/transforms-to-ui-types/transformToSubmissionsInfo";
import { transformToIssuesInfo } from "@/transforms-to-ui-types/transformToIssuesInfo";
import { transformToReviewsInfo } from "@/transforms-to-ui-types/transformToReviewsInfo";
import { useProjectDataContext } from "@/app/contexts/project/ProjectDataContext";

const Skeleton = dynamic(() =>
    import("@/components/ui/skeleton").then((mod) => mod.Skeleton)
);
const WorksMultiBox = dynamic(() => import("@/components/lists/WorksMultiBox"));

// Needs more work and organization. Version control-Unified editor integration TBD.

export default function ProjectOverviewPage({
    params,
}: {
    params: { identifier: string; projectName: string };
}) {
    // Preliminaries
    const { identifier, projectName } = params;

    // States
    const [identifierType, setIdentifierType] =
        useState<OwnershipResult | null>(null);
    const [projectDelta, setProjectDelta] = useState<ProjectDelta | null>(null);
    const [isProjectDataAvailable, setIsProjectDataAvailable] = useState(false);
    const [isProjectDeltaAvailable, setIsProjectDeltaAvailable] =
        useState(false);

    // Contexts: supabase, project, userId, editMode and currentFieldsVersions
    const supabase = useSupabaseClient();

    const { projectLayout, setProjectLayout, isLoading, setIsLoading } =
        useProjectDataContext();

    const {
        setIdentifier,
        projectName: contextProjectName,
        setProjectName,
    } = useProject();

    // Contexts
    // - Current user
    const currentUserId = useUserId();

    // - Project Edit Mode
    const {
        isEditModeOn,
        toggleEditMode,
        setProjectId,
        projectSubmissionId,
        setProjectSubmissionId,
    } = useProjectEditModeContext();


    const currentFieldsContext = useContext(CurrentFieldsVersionsContext);
    if (!currentFieldsContext) {
        throw new Error(
            "CurrentFieldsVersionsContext is undefined, make sure it is provided in component tree"
        );
    }
    const { description, markFieldAsEdited } = currentFieldsContext;

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
        <div className="flex pl-4 pb-10">
            <div className="flex-1 mt-4 mr-4">
                {/* Description */}
                <div className="border rounded-lg shadow-lg col-span-2">
                    <div
                        className="text-gray-900 text-lg font-semibold py-2 px-4 rounded-t-lg border-b border-gray-200"
                        style={{
                            backgroundColor: "var(--page-header-bg-color)",
                            fontWeight: "500",
                            fontSize: "18px",
                        }}
                    >
                        Description
                    </div>

                    <div className="px-4 py-2 break-words">
                        {!isLoading ? (
                            projectLayout?.description
                        ) : (
                            <Skeleton className="w-full h-6 bg-gray-400 m-2" />
                        )}
                    </div>
                </div>

                {/* Info Boxes */}
            </div>
            <ProjectPanel
                metadata={{
                    doi: projectLayout?.doi,
                    license: projectLayout?.license,
                    researchGrants: projectLayout?.researchGrants,
                    keywords: projectLayout?.keywords,
                    fieldsOfResearch: projectLayout?.fieldsOfResearch,
                }}
            />
        </div>
    );
}
