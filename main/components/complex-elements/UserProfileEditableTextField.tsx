import { Skeleton } from "@/components/ui/skeleton";
import { UserProfileChanges } from "@/contexts/current-user/UserDataContext";
import { useUserProfileEditableTextField } from "@/hooks/utils/useUserProfileEditableTextField";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DisplayTextWithNewLines } from "../light-simple-elements/TextWithLines";
import { useEffect, useRef } from "react";

interface UserProfileEditableTextFieldProps {
    label?: string;
    fieldKey: string;
    initialVersionContent: string;
    isEditModeOn: boolean;
    currentEdits: UserProfileChanges;
    setCurrentEdits: (userProfileDeltaChanges: UserProfileChanges) => void;
    isLoading?: boolean;
    className?: string;
    flex?: boolean;
}

const UserProfileEditableTextField: React.FC<UserProfileEditableTextFieldProps> = ({
    label,
    fieldKey,
    isEditModeOn,
    initialVersionContent,
    currentEdits,
    setCurrentEdits,
    isLoading,
    className,
    flex,
}) => {
    const {
        isTextFieldEditable,
        currentContent,
        editedContent,
        setEditedContent,
        toggleEditState,
    } = useUserProfileEditableTextField({
        fieldKey,
        isEditModeOn,
        initialVersionContent,
        currentEdits,
        setCurrentEdits,
    });
    
    // Manage textarea height
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    // Adjust height on mount and when editedContent changes
    useEffect(() => {
        adjustTextareaHeight();
    }, [isTextFieldEditable, editedContent]);

    return (
        <div className={`${flex ? "flex items-center" : ""} font-semibold pt-2 ${className || ""}`}>
            <div className="flex items-center whitespace-nowrap">
                {label + ": "}
                {isEditModeOn && (
                    <button className="ml-2" onClick={toggleEditState}>
                        <FontAwesomeIcon
                            icon={faPen}
                            className="small-icon text-gray-700 hover:text-gray-900"
                        />
                    </button>
                )}
            </div>
            <div className="pl-2 text-gray-700 font-normal text-sm">
                {!isLoading ? (
                    <>
                        {!isEditModeOn ? (
                            <DisplayTextWithNewLines text={initialVersionContent} />
                        ) : !isTextFieldEditable ? (
                            <DisplayTextWithNewLines text={currentContent} />
                        ) : (
                            <textarea
                                ref={textareaRef}
                                id="textField"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full focus:outline-none"
                            />
                        )}
                    </>
                ) : (
                    <Skeleton className="w-full h-6 bg-gray-400 m-2" />
                )}
            </div>
        </div>
    );
};

export default UserProfileEditableTextField;
