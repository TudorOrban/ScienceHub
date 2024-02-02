import { useState, useEffect } from "react";
import { TextDiff, WorkDelta, WorkDeltaKey, WorkSubmission } from "@/types/versionControlTypes";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { calculateDiffs } from "../diff-logic/calculateTextDiffs";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";
import { toSupabaseDateFormat } from "@/utils/functions";

interface UseWorkEditableTextFieldProps {
    fieldKey: string;
    isEditModeOn: boolean;
    initialVersionContent: string;
    selectedWorkSubmission: WorkSubmission;
    workDeltaChanges: WorkDelta;
    setWorkDeltaChanges: (workDeltaChanges: WorkDelta) => void;
}

/**
 * Hook for managing the state of an editable project field of type TextArray
 */
export const useWorkEditableTextField = ({
    fieldKey,
    initialVersionContent,
    selectedWorkSubmission,
    workDeltaChanges,
    setWorkDeltaChanges,
    isEditModeOn,
}: UseWorkEditableTextFieldProps) => {
    // States
    const [isTextFieldEditable, setIsTextFieldEditable] = useState<boolean>(false);
    const [currentContent, setCurrentContent] = useState<string>(initialVersionContent);
    const [editedContent, setEditedContent] = useState<string>(initialVersionContent);

    // Contexts
    const { setOperations } = useToastsContext();
    const { userSmall, setUserSmall } = useUserSmallDataContext();

    // Update content on state change
    useEffect(() => {
        if (isEditModeOn && selectedWorkSubmission && selectedWorkSubmission.id !== 0) {
            if (selectedWorkSubmission.status === "Accepted") return;

            const deltaChangesDiffs = workDeltaChanges?.[fieldKey as WorkDeltaKey]?.textDiffs;
            const deltaDiffs =
                selectedWorkSubmission.workDelta?.[fieldKey as WorkDeltaKey]?.textDiffs;
            // Use delta changes if diffs non-empty, otherwise database delta
            const useDeltaChanges = deltaChangesDiffs && deltaChangesDiffs?.length > 0;
            const correspondingDiffs = useDeltaChanges ? deltaChangesDiffs : deltaDiffs;

            // Apply delta changes and set it to current content
            if (correspondingDiffs && correspondingDiffs.length > 0) {
                setCurrentContent(applyTextDiffs(initialVersionContent, correspondingDiffs));
            }
        }
    }, [fieldKey, initialVersionContent, isEditModeOn, selectedWorkSubmission, workDeltaChanges]);

    // Save to a context variable on exiting text area
    const handleSaveToWorkDeltaChanges = () => {
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
        if (selectedWorkSubmission.id === 0) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Submission",
                    customMessage: "No work submission is currently selected.",
                },
            ]);
        }
        if (currentContent !== editedContent) {
            // Compute diff against *initial version content*
            const textDiffs = calculateDiffs(initialVersionContent, editedContent);

            // Update delta with diffs and metadata
            const updatedWorkDeltaChanges: WorkDelta = {
                ...workDeltaChanges,
                [fieldKey]: {
                    type: "TextDiff",
                    textDiffs: textDiffs,
                    lastChangeDate: toSupabaseDateFormat(new Date().toISOString()),
                    lastChangeUser: userSmall.data[0],
                },
            };
            setWorkDeltaChanges(updatedWorkDeltaChanges);
        }
    };

    const toggleEditState = () => {
        if (!isTextFieldEditable) {
            if (selectedWorkSubmission.status !== "Accepted") {
                setEditedContent(currentContent);
                setIsTextFieldEditable(true);
            } else {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Submission",
                        customMessage: "The submission has already been accepted",
                    },
                ]);
            }
        } else {
            // On closing text area, save changes to workDeltaChanges (context variable)
            handleSaveToWorkDeltaChanges();
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
