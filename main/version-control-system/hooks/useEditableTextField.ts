import { useState, useEffect } from "react";
import { TextDiff, WorkDeltaKey, WorkSubmission } from "@/types/versionControlTypes";
import { computeTextDiff } from "@/version-control-system/computeTextDiff";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { WorkMetadata } from "@/types/workTypes";
import { useUpdateWorkDeltaField } from "@/hooks/update/useUpdateWorkDeltaField";
import { calculateDiffs } from "../diff-logic/calculateTextDiffs";

interface UseEditableTextFieldProps {
    fieldKey: string;
    initialVersionContent: string;
    selectedWorkSubmission: WorkSubmission;
    isEditModeOn: boolean;
    isMetadataField?: boolean;
}

export const useEditableTextField = ({
    fieldKey,
    initialVersionContent,
    selectedWorkSubmission,
    isEditModeOn,
    isMetadataField = false,
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
            const correspondingDiffs = isMetadataField
                ? selectedWorkSubmission.workDelta?.workMetadata?.[fieldKey as keyof WorkMetadata]
                : selectedWorkSubmission.workDelta?.[fieldKey as WorkDeltaKey];
            setCurrentContent(
                applyTextDiffs(initialVersionContent, (correspondingDiffs as TextDiff[]) || [])
            );
        }
    }, [fieldKey, initialVersionContent, isEditModeOn, selectedWorkSubmission]);

    // Save to submission delta on textarea close
    // const handleSaveToSubmission = async () => {
    //     if (selectedWorkSubmission?.id !== 0 && initialVersionContent !== editedContent) {
    //         const textDiffs = computeTextDiff(initialVersionContent, editedContent);

    //         try {
    //             // Updated delta (depending on whether metadata field or not)
    //             const updatedDelta = isMetadataField ? {
    //                 ...selectedWorkSubmission?.workDelta,
    //                 workMetadata: {
    //                     ...selectedWorkSubmission?.workDelta?.workMetadata,
    //                     [fieldKey]: textDiffs,
    //                 }
    //             } : {
    //                 ...selectedWorkSubmission?.workDelta,
    //                 [fieldKey]: textDiffs,
    //             };

    //             // Update submission
    //             const updatedSubmission = await updateSubmission.mutateAsync({
    //                 tableName: "work_submissions",
    //                 identifierField: "id",
    //                 identifier: selectedWorkSubmission.id,
    //                 updateFields: {
    //                     work_delta: updatedDelta,
    //                 },
    //             });

    //             if (updateSubmission.error || updatedSubmission.error) {
    //                 setOperations([
    //                     {
    //                         operationType: "update",
    //                         operationOutcome: "error",
    //                         entityType: "Submission",
    //                     },
    //                 ]);
    //             } else {
    //                 setCurrentContent(editedContent);
    //             }
    //         } catch (error) {
    //             console.error("An error occurred while saving: ", error);
    //         }
    //     }
    // };
    const updateDelta = useUpdateWorkDeltaField();

    const handleSaveToSubmission = async () => {
        if (selectedWorkSubmission?.id !== 0 && currentContent !== editedContent) {
            // Compute text diffs against initial version content
            const textDiffs = calculateDiffs(initialVersionContent, editedContent);

            // Determine the field path for JSONB update
            const fieldPath = isMetadataField ? ["workMetadata", fieldKey] : [fieldKey];

            try {
                // Use stored procedure to only update appropriate field
                await updateDelta.mutateAsync({
                    submissionId: selectedWorkSubmission.id,
                    fieldPath: fieldPath,
                    newValue: textDiffs,
                });

                if (updateDelta.isError) {
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
            // if (selectedWorkSubmission.status !== "Accepted") {
                if (true){
                setEditedContent(currentContent);
                setIsTextFieldEditable(true);
            } else {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Submission",
                        customMessage: "The submission has already been accepted"
                    },
                ]);
            }
        } else {
            handleSaveToSubmission();
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
