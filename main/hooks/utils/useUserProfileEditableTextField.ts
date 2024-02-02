import { useState, useEffect } from "react";
import { UserProfileChanges } from "@/contexts/current-user/UserDataContext";

interface UseUserProfileEditableTextFieldProps {
    fieldKey: string;
    isEditModeOn: boolean;
    initialVersionContent: string;
    currentEdits: UserProfileChanges;
    setCurrentEdits: (userProfileDeltaChanges: UserProfileChanges) => void;
}

/**
 * Hook managing the state of an editable text field in UserProfile page, decoupled from the UI
 */
export const useUserProfileEditableTextField = ({
    fieldKey,
    initialVersionContent,
    currentEdits,
    setCurrentEdits,
    isEditModeOn,
}: UseUserProfileEditableTextFieldProps) => {
    // States
    const [isTextFieldEditable, setIsTextFieldEditable] = useState<boolean>(false);
    const [currentContent, setCurrentContent] = useState<string>(initialVersionContent);
    const [editedContent, setEditedContent] = useState<string>(initialVersionContent);

    // Update content on state change
    useEffect(() => {
        if (isEditModeOn) {
            const content = currentEdits?.[fieldKey] || initialVersionContent;
            // Only use for string fields
            setCurrentContent(content as string);
        }
    }, [fieldKey, initialVersionContent, isEditModeOn]);

    // Save to a context variable on exiting text area
    const handleSaveToCurrentEdits = () => {
        if (currentContent !== editedContent) {
            // Update delta with diffs and metadata
            const updatedCurrentEdits: UserProfileChanges = {
                ...currentEdits,
                [fieldKey]: editedContent,
            };
            setCurrentEdits(updatedCurrentEdits);
        }
    };

    const toggleEditState = () => {
        if (!isTextFieldEditable) {
            setEditedContent(currentContent);
            setIsTextFieldEditable(true);
        } else {
            // On closing text area, save changes to currentEdits (context variable)
            handleSaveToCurrentEdits();
            setCurrentContent(editedContent);
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
