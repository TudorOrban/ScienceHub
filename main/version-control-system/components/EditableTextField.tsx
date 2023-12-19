import { Skeleton } from "@/components/ui/skeleton";
import { WorkSubmission } from "@/types/versionControlTypes";
import { useEditableTextField } from "@/version-control-system/hooks/useEditableTextField";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface EditableTextFieldProps {
    label?: string;
    fieldKey: string;
    initialVersionContent: string;
    isEditModeOn: boolean;
    selectedWorkSubmission: WorkSubmission;
    isMetadataField?: boolean;
    isLoading?: boolean;
    className?: string;
    flex?: boolean;
}


const EditableTextField: React.FC<EditableTextFieldProps> = ({
    label,
    fieldKey,
    initialVersionContent,
    isEditModeOn,
    selectedWorkSubmission,
    isMetadataField,
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
    } = useEditableTextField({
        fieldKey,
        initialVersionContent,
        selectedWorkSubmission,
        isEditModeOn,
        isMetadataField,
    });

    return (
        <div className={`${flex ? "flex items-center" : ""} font-semibold pt-2 ${className || ""}`}>
            <div className="flex items-center whitespace-nowrap">
                {label + ": "}
                {isEditModeOn && (
                    <button
                        className="ml-2"
                        onClick={toggleEditState}
                    >
                        <FontAwesomeIcon icon={faPen} className="small-icon text-gray-700 hover:text-gray-900" />
                    </button>
                )}
            </div>
            <div className="pl-2 text-gray-700 font-normal text-sm">
                {!isLoading ? (
                    <>
                        {!isEditModeOn ? (
                            <p>{initialVersionContent}</p>
                        ) : !isTextFieldEditable ? (
                            <p>{currentContent}</p>
                        ) : (
                            <textarea
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

export default EditableTextField;