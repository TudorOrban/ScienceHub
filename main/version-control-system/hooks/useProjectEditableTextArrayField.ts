import { useState, useEffect } from "react";
import { ProjectDelta, ProjectDeltaKey, ProjectSubmission } from "@/types/versionControlTypes";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";
import { toSupabaseDateFormat } from "@/utils/functions";

interface UseProjectEditableTextArrayFieldProps {
    fieldKey: string;
    initialVersionContents: string[];
    selectedProjectSubmission: ProjectSubmission;
    projectDeltaChanges: ProjectDelta;
    setProjectDeltaChanges: (projectDeltaChanges: ProjectDelta) => void;
    isEditModeOn: boolean;
}

export const useProjectEditableTextArrayField = ({
    fieldKey,
    isEditModeOn,
    initialVersionContents,
    selectedProjectSubmission,
    projectDeltaChanges,
    setProjectDeltaChanges,
}: UseProjectEditableTextArrayFieldProps) => {
    // States
    const [isTextFieldEditable, setIsTextFieldEditable] = useState<boolean[]>(initialVersionContents.map((content) => false));
    const [currentContents, setCurrentContents] = useState<string[]>(initialVersionContents);
    const [editedContents, setEditedContents] = useState<string[]>(initialVersionContents);

    // Contexts
    const { setOperations } = useToastsContext();
    const { userSmall, setUserSmall } = useUserSmallDataContext();

    // Update content on state change
    useEffect(() => {
        if (isEditModeOn && selectedProjectSubmission && selectedProjectSubmission.id !== 0) {
            const deltaChangesDiffs = projectDeltaChanges?.[fieldKey as ProjectDeltaKey]?.textArrays;
            const deltaDiffs =
                selectedProjectSubmission.projectDelta?.[fieldKey as ProjectDeltaKey]?.textArrays;
            // Use delta changes if diffs non-empty, otherwise database delta
            const useDeltaChanges = deltaChangesDiffs && deltaChangesDiffs?.length > 0;
            const correspondingDiffs = useDeltaChanges ? deltaChangesDiffs : deltaDiffs;

            // Apply delta changes and set it to current content
            if (correspondingDiffs && correspondingDiffs.length > 0) {
                setCurrentContents(correspondingDiffs);
            }
        }
    }, [fieldKey, initialVersionContents, isEditModeOn, selectedProjectSubmission, projectDeltaChanges]);
    
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
        if (currentContents !== editedContents) {
            const updatedProjectDeltaChanges: ProjectDelta = {
                      ...projectDeltaChanges,
                      [fieldKey]: {
                        type: "TextArray",
                        textArrays: editedContents,
                        lastChangeDate: toSupabaseDateFormat(new Date().toISOString()),
                        lastChangeUser: userSmall.data[0],
                    },
                  };

            setProjectDeltaChanges(updatedProjectDeltaChanges);
        }
    };

    const toggleEditState = (index: number) => {
        if (!isTextFieldEditable[index]) {
            if (selectedProjectSubmission.status !== "Accepted") {
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
            handleSaveToProjectDeltaChanges();
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
        handleSaveToProjectDeltaChanges();
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