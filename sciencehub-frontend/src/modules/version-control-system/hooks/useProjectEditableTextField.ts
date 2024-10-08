import { useState, useEffect } from "react";
import { ProjectDelta, ProjectDeltaKey, ProjectSubmission } from "@/src/types/versionControlTypes";
import { applyTextDiffs } from "@/src/modules/version-control-system/diff-logic/applyTextDiff";
import { useToastsContext } from "@/src/contexts/general/ToastsContext";
import { calculateDiffs } from "../diff-logic/calculateTextDiffs";
import { useUserSmallDataContext } from "@/src/contexts/current-user/UserSmallData";
import { toSupabaseDateFormat } from "@/src/utils/functions";

interface UseProjectEditableTextFieldProps {
    fieldKey: string;
    isEditModeOn: boolean;
    initialVersionContent: string;
    selectedProjectSubmission: ProjectSubmission;
    projectDeltaChanges: ProjectDelta;
    setProjectDeltaChanges: (projectDeltaChanges: ProjectDelta) => void;
}

/**
 * Hook for managing the state of an editable project field of type Text
 */
export const useProjectEditableTextField = ({
    fieldKey,
    initialVersionContent,
    selectedProjectSubmission,
    projectDeltaChanges,
    setProjectDeltaChanges,
    isEditModeOn,
}: UseProjectEditableTextFieldProps) => {
    // States
    const [isTextFieldEditable, setIsTextFieldEditable] = useState<boolean>(false);
    const [currentContent, setCurrentContent] = useState<string>(initialVersionContent);
    const [editedContent, setEditedContent] = useState<string>(initialVersionContent);

    // Contexts
    const { setOperations } = useToastsContext();
    const { userSmall, setUserSmall } = useUserSmallDataContext();

    // Update content on state change
    useEffect(() => {
        if (isEditModeOn && selectedProjectSubmission && selectedProjectSubmission.id !== 0) {
            if (selectedProjectSubmission.status === "Accepted") return;
            const deltaChangesDiffs = projectDeltaChanges?.[fieldKey as ProjectDeltaKey]?.textDiffs;
            const deltaDiffs =
                selectedProjectSubmission.projectDelta?.[fieldKey as ProjectDeltaKey]?.textDiffs;
            // Use delta changes if diffs non-empty, otherwise database delta
            const useDeltaChanges = deltaChangesDiffs && deltaChangesDiffs?.length > 0;
            const correspondingDiffs = useDeltaChanges ? deltaChangesDiffs : deltaDiffs;

            // Apply delta changes and set it to current content
            if (correspondingDiffs && correspondingDiffs.length > 0) {
                setCurrentContent(applyTextDiffs(initialVersionContent, correspondingDiffs));
            }
        }
    }, [
        fieldKey,
        initialVersionContent,
        isEditModeOn,
        selectedProjectSubmission,
        projectDeltaChanges,
    ]);

    // Save to a context variable on exiting text area
    const handleSaveToProjectDeltaChanges = () => {
        if (!userSmall.data[0]) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Submission",
                    customMessage: "No current user found.",
                },
            ]);
        }
        if (selectedProjectSubmission.id === 0) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Submission",
                    customMessage: "No project submission is currently selected.",
                },
            ]);
        }
        if (currentContent !== editedContent) {
            // Compute diff against *initial version content*
            const textDiffs = calculateDiffs(initialVersionContent, editedContent);

            // Update delta with diffs and metadata
            const updatedProjectDeltaChanges: ProjectDelta = {
                ...projectDeltaChanges,
                [fieldKey]: {
                    type: "TextDiff",
                    textDiffs: textDiffs,
                    lastChangeDate: toSupabaseDateFormat(new Date().toISOString()),
                    lastChangeUser: userSmall.data[0],
                },
            };
            setProjectDeltaChanges(updatedProjectDeltaChanges);
        }
    };

    const toggleEditState = () => {
        if (!isTextFieldEditable) {
            if (selectedProjectSubmission.status !== "Accepted") {
                setEditedContent(currentContent);
                setIsTextFieldEditable(true);
            } else {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Submission",
                        customMessage: "The project submission has already been accepted",
                    },
                ]);
            }
        } else {
            // On closing text area, save changes to projectDeltaChanges (context variable)
            handleSaveToProjectDeltaChanges();
            setIsTextFieldEditable(false);
        }
    };

    return {
        isTextFieldEditable,
        currentContent,
        editedContent,
        setEditedContent,
        toggleEditState,
    };
};
