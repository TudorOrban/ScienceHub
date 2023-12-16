import { useState, useEffect } from "react";
import { WorkDeltaDiffsKey, WorkSubmission } from "@/types/versionControlTypes";
import { computeTextDiff } from "@/version-control-system/computeTextDiff";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useToastsContext } from "@/contexts/general/ToastsContext";

interface UseEditableTextFieldProps {
    // fieldKey: keyof WorkTextFieldsDiffs;
    fieldKey: string;
    initialVersionContent: string;
    selectedWorkSubmission: WorkSubmission;
    isEditModeOn: boolean;
}

export const useEditableTextField = ({
    fieldKey,
    initialVersionContent,
    selectedWorkSubmission,
    isEditModeOn,
}: UseEditableTextFieldProps) => {
    // States
    const [isTextFieldEditable, setIsTextFieldEditable] = useState<boolean>(false);
    const [currentContent, setCurrentContent] = useState<string>(initialVersionContent);
    const [editedContent, setEditedContent] = useState<string>(initialVersionContent);

    // Contexts
    const { setOperations } = useToastsContext();

    // Update mutation hook
    const updateSubmission = useUpdateGeneralData();

    // Update content on state change
    useEffect(() => {
        if (isEditModeOn && selectedWorkSubmission && selectedWorkSubmission.id !== 0) {
            const correspondingDiffs = selectedWorkSubmission.workDelta?.textDiffs?.[fieldKey as WorkDeltaDiffsKey];
            setCurrentContent(applyTextDiffs(initialVersionContent, correspondingDiffs || []));
        }
    }, [fieldKey, initialVersionContent, isEditModeOn, selectedWorkSubmission]);

    // Save to submission delta on textarea close
    const handleSaveToSubmission = async () => {
        if (selectedWorkSubmission?.id !== 0 && initialVersionContent !== editedContent) {
            const textDiffs = computeTextDiff(initialVersionContent, editedContent);

            try {
                const updatedSubmission = await updateSubmission.mutateAsync({
                    tableName: "work_submissions",
                    identifierField: "id",
                    identifier: selectedWorkSubmission.id,
                    updateFields: {
                        work_delta: {
                            ...selectedWorkSubmission.workDelta,
                            textDiffs: {
                                ...selectedWorkSubmission.workDelta.textDiffs,
                                [fieldKey]: textDiffs,
                            },
                        },
                    },
                });

                if (updateSubmission.error || updatedSubmission.error) {
                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Submission",
                        },
                    ]);
                } else {
                    setCurrentContent(editedContent);
                }
            } catch (error) {
                console.error("An error occurred while saving: ", error);
            }
        }
    };

    const toggleEditState = () => {
        if (!isTextFieldEditable) {
            setEditedContent(currentContent);
        } else {
            handleSaveToSubmission();
        }
        setIsTextFieldEditable(!isTextFieldEditable);
    };

    return {
        isTextFieldEditable,
        currentContent,
        editedContent,
        setEditedContent,
        toggleEditState,
    };
};
