import { useState, useEffect } from "react";
import { ArrayDiff, TextDiff, WorkDeltaKey, WorkSubmission } from "@/types/versionControlTypes";
import { computeTextDiff } from "@/version-control-system/computeTextDiff";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { WorkMetadata } from "@/types/workTypes";
import { useUpdateWorkDeltaField } from "@/hooks/update/useUpdateWorkDeltaField";
import { applyArrayDiffs } from "../diff-logic/applyArrayDiffs";

interface UseEditableTextArrayFieldProps {
    fieldKey: string;
    initialVersionContents: string[];
    selectedWorkSubmission: WorkSubmission;
    isEditModeOn: boolean;
    isMetadataField?: boolean;
}

export const useEditableTextArrayField = ({
    fieldKey,
    initialVersionContents,
    selectedWorkSubmission,
    isEditModeOn,
    isMetadataField = false,
}: UseEditableTextArrayFieldProps) => {
    // States
    const [isTextFieldEditable, setIsTextFieldEditable] = useState<boolean[]>(initialVersionContents.map((content) => false));
    const [currentContents, setCurrentContents] = useState<string[]>(initialVersionContents);
    const [editedContents, setEditedContents] = useState<string[]>(initialVersionContents);

    // Contexts
    const { setOperations } = useToastsContext();

    // Update content on state change
    useEffect(() => {
        if (isEditModeOn && selectedWorkSubmission && selectedWorkSubmission.id !== 0) {
            const correspondingDiffs = isMetadataField
                ? selectedWorkSubmission.workDelta?.workMetadata?.[fieldKey as keyof WorkMetadata]
                : selectedWorkSubmission.workDelta?.[fieldKey as WorkDeltaKey];
            setCurrentContents(
                applyArrayDiffs<string>(initialVersionContents, correspondingDiffs as ArrayDiff<string>[] || [])
            );
        }
    }, [fieldKey, initialVersionContents, isEditModeOn, selectedWorkSubmission]);
    
    const updateDelta = useUpdateWorkDeltaField();

    const handleSaveToSubmission = async () => {
        if (selectedWorkSubmission?.id !== 0 && initialVersionContents !== editedContents) {
            // const arrayTextDiffs = s(initialVersionContents, editedContents);
            const arrayTextDiffs: ArrayDiff<string>[] = [];

            // Determine the field path for JSONB update
            const fieldPath = isMetadataField ? ["workMetadata", fieldKey] : [fieldKey];

            try {
                // Use the new mutation to update the specific field
                await updateDelta.mutateAsync({
                    submissionId: selectedWorkSubmission.id,
                    fieldPath: fieldPath,
                    newValue: arrayTextDiffs,
                });

                // Check for errors in mutation
                if (updateDelta.isError) {
                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Submission",
                        },
                    ]);
                } else {
                    setCurrentContents(editedContents);
                }
            } catch (error) {
                console.error("An error occurred while saving: ", error);
                // Handle the error appropriately
            }
        }
    };

    const toggleEditState = () => {
        if (!isTextFieldEditable) {
            // if (selectedWorkSubmission.status !== "Accepted") {
            if (true) {
                setEditedContents(currentContents);
                const 
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
    

    const handleAddContent = async () => {
        console.log("DSADAS", currentContents, isTextFieldEditable);
        const newContents = [...currentContents, ""];
        setCurrentContents(newContents);
        const newIsTextFieldEditable = [...isTextFieldEditable, true];
        setIsTextFieldEditable(newIsTextFieldEditable);

        const arrayTextDiffs: ArrayDiff<string>[] = [];

        // Determine the field path for JSONB update
        const fieldPath = isMetadataField ? ["workMetadata", fieldKey] : [fieldKey];

        try {
            // Use the new mutation to update the specific field
            await updateDelta.mutateAsync({
                submissionId: selectedWorkSubmission.id,
                fieldPath: fieldPath,
                newValue: arrayTextDiffs,
            });

            // Check for errors in mutation
            if (updateDelta.isError) {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Submission",
                    },
                ]);
            } else {
                setCurrentContents(editedContents);
            }
        } catch (error) {
            console.error("An error occurred while saving: ", error);
            // Handle the error appropriately
        }
    }
    

    return {
        isTextFieldEditable,
        currentContents,
        editedContents,
        setEditedContents,
        handleAddContent,
        toggleEditState,
    };
};
