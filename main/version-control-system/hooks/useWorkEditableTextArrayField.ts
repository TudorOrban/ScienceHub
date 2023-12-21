import { useState, useEffect } from "react";
import { WorkDelta, WorkDeltaKey, WorkSubmission } from "@/types/versionControlTypes";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";
import { toSupabaseDateFormat } from "@/utils/functions";

interface UseWorkEditableTextArrayFieldProps {
    fieldKey: string;
    initialVersionContents: string[];
    selectedWorkSubmission: WorkSubmission;
    workDeltaChanges: WorkDelta;
    setWorkDeltaChanges: (workDeltaChanges: WorkDelta) => void;
    isEditModeOn: boolean;
}

export const useWorkEditableTextArrayField = ({
    fieldKey,
    isEditModeOn,
    initialVersionContents,
    selectedWorkSubmission,
    workDeltaChanges,
    setWorkDeltaChanges,
}: UseWorkEditableTextArrayFieldProps) => {
    // States
    const [isTextFieldEditable, setIsTextFieldEditable] = useState<boolean[]>(initialVersionContents.map((content) => false));
    const [currentContents, setCurrentContents] = useState<string[]>(initialVersionContents);
    const [editedContents, setEditedContents] = useState<string[]>(initialVersionContents);

    // Contexts
    const { setOperations } = useToastsContext();
    const { userSmall, setUserSmall } = useUserSmallDataContext();

    // Update content on state change
    useEffect(() => {
        if (isEditModeOn && selectedWorkSubmission && selectedWorkSubmission.id !== 0) {
            const deltaChangesDiffs = workDeltaChanges?.[fieldKey as WorkDeltaKey]?.textArrays;
            const deltaDiffs =
                selectedWorkSubmission.workDelta?.[fieldKey as WorkDeltaKey]?.textArrays;
            // Use delta changes if diffs non-empty, otherwise database delta
            const useDeltaChanges = deltaChangesDiffs && deltaChangesDiffs?.length > 0;
            const correspondingDiffs = useDeltaChanges ? deltaChangesDiffs : deltaDiffs;

            // Apply delta changes and set it to current content
            if (correspondingDiffs && correspondingDiffs.length > 0) {
                setCurrentContents(correspondingDiffs);
            }
        }
    }, [fieldKey, initialVersionContents, isEditModeOn, selectedWorkSubmission, workDeltaChanges]);
    
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
        if (currentContents !== editedContents) {
            const updatedWorkDeltaChanges: WorkDelta = {
                      ...workDeltaChanges,
                      [fieldKey]: {
                        type: "TextArray",
                        textArrays: editedContents,
                        lastChangeDate: toSupabaseDateFormat(new Date().toISOString()),
                        lastChangeUser: userSmall.data[0],
                    },
                  };

            setWorkDeltaChanges(updatedWorkDeltaChanges);
        }
    };

    const toggleEditState = (index: number) => {
        if (!isTextFieldEditable[index]) {
            if (selectedWorkSubmission.status !== "Accepted") {
                setEditedContents(currentContents);
                let newIsTextFieldEditable = [...isTextFieldEditable];
                newIsTextFieldEditable[index] = true;
                setIsTextFieldEditable(newIsTextFieldEditable);
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
            handleSaveToWorkDeltaChanges();
            let newIsTextFieldEditable = [...isTextFieldEditable];
            newIsTextFieldEditable[index] = false;
            setIsTextFieldEditable(newIsTextFieldEditable);
            setCurrentContents(editedContents);
        }
    };
    

    const handleAddContent = () => {
        const newContents = [...currentContents, ""];
        setCurrentContents(newContents);
        const newIsTextFieldEditable = [...isTextFieldEditable, true];
        setIsTextFieldEditable(newIsTextFieldEditable);
    }

    const handleRemoveContent = (contentIndex: number) => {
        setCurrentContents(currentContents.filter((content, index) => index !== contentIndex));
        handleSaveToWorkDeltaChanges();
    }
    

    return {
        isTextFieldEditable,
        currentContents,
        editedContents,
        setEditedContents,
        handleAddContent,
        toggleEditState,
        handleRemoveContent,
    };
};