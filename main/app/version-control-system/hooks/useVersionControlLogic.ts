import { ProjectEditModeContext } from "@/app/contexts/search-contexts/version-control/ProjectEditModeContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect } from "react";
import { useSaveLogic } from "./useSaveLogic";
import { useSubmissionLogic } from "./useSubmissionLogic";
import { ProjectDelta, TextDiff } from "@/types/versionControlTypes";
import { useProjectDeltaSearch } from "@/app/hooks/fetch/search-hooks/submissions/useProjectDeltaSearch";
import { mergeProjectDeltaIntoProjectData } from "../mergeProjectDeltaIntoProjectData";
import {
    CurrentFieldsVersionsContext,
    editableKeysArray,
} from "@/app/contexts/search-contexts/version-control/CurrentFieldsVersionsContext";
import { ProjectLayout } from "@/types/projectTypes";
import useProjectData from "@/app/hooks/fetch/data-hooks/projects/useProjectDataTest";

export const useVersionControlLogic = (userId: string, projectId: number, enabled?: boolean) => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    // Edit mode
    const editModeContext = useContext(ProjectEditModeContext);

    if (!editModeContext) {
        throw new Error(
            "ProjectEditModeContext must be used within a ProjectEditModeProvider"
        );
    }

    const {
        isEditModeOn,
        toggleEditMode,
        setProjectId,
        projectSubmissionId,
        setProjectSubmissionId,
    } = editModeContext;

    useEffect(() => {
        if (projectId) {
            setProjectId(projectId);
        }
    }, [projectId]);

    // Custom hook for handling submission data (and the submission select)
    const {
        selectedSubmission,
        setSelectedSubmission,
        submissionsData,
        submissionsError,
        submissionsLoading,
        handleChange,
        selectedSubmissionData,
        versionInfo,
    } = useSubmissionLogic(
        userId,
        projectId,
        projectSubmissionId,
        setProjectSubmissionId,
        enabled,
    );

    // Find deltas with submission's version ids
    const projectDeltas = useProjectDeltaSearch(
        [versionInfo?.initialProjectVersionId || ""],
        [versionInfo?.finalProjectVersionId || ""],
        versionInfo?.areVersionsDefined || false
    );

    // Get the (hopefully unique) delta from fetched data
    const isProjectDeltaUnique = projectDeltas?.data?.length === 0; // TODO: handle > 0 for integrity
    const projectDelta =
        (projectDeltas?.data || [])[0] || null;

    // Project data
    const initialVersionProjectData =
        useProjectData(projectId, true);

    const mergedProjectData = projectDelta?.deltaData
        ? mergeProjectDeltaIntoProjectData(
              (initialVersionProjectData.data || [])[0] || { id: 0, public: true },
              projectDelta.deltaData as unknown as Record<
                  string,
                  TextDiff[]
              >
          )
        : initialVersionProjectData;

    const context = useContext(CurrentFieldsVersionsContext);

    if (!context) {
        throw new Error(
            "Context is undefined, make sure it is provided in component tree"
        );
    }
    // Update mergedProjectData with latest values from context for editable fields
    const finalVersionProjectData = { ...mergedProjectData } as ProjectLayout;

    editableKeysArray.forEach((key) => {
        finalVersionProjectData[key] = context[key];
    });

    // The logic for saving delta to database
    const { handleSave } = useSaveLogic(
        projectSubmissionId,
        projectId || 0,
        projectDelta?.id || 0,
        versionInfo,
        (initialVersionProjectData.data || [])[0] || { id: 0, public: true },
        finalVersionProjectData || { id: 0, public: true },
        ["description"]
    );

    // integrity check and delta refetching
    useEffect(() => {
        // Ensure selectedSubmissionData and projectDeltas are both available
        if (
            submissionsData &&
            projectDeltas &&
            projectDeltas.data &&
            projectDeltas.data.length > 0
        ) {
            const fetchedDeltaId =
                projectDeltas.data[0].id || 0;

            const newDelta = {
                id: fetchedDeltaId,
                initialProjectVersionId:
                    selectedSubmissionData?.initialProjectVersionId || 0,
                finalProjectVersionId:
                    selectedSubmissionData?.finalProjectVersionId || 0,
                // deltaData: { ...currentProjectDelta?.deltaData },
                deltaData: {},
            };
        }
    }, [selectedSubmissionData, projectSubmissionId, projectDeltas]);

    return {
        isEditModeOn,
        toggleEditMode,
        selectedSubmission,
        setSelectedSubmission,
        submissionsData,
        handleChange,
        versionInfo,
        handleSave,
        projectDelta,
    };
};
