import { Skeleton } from "@/components/ui/skeleton";
import { WorkDelta, WorkSubmission } from "@/types/versionControlTypes";
import { useEditableTextField } from "@/version-control-system/hooks/useEditableTextField";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface EditableTextFieldProps {
    label?: string;
    fieldKey: string;
    initialVersionContent: string;
    isEditModeOn: boolean;
    selectedWorkSubmission: WorkSubmission;
    workDeltaChanges: WorkDelta;
    setWorkDeltaChanges: (workDeltaChanges: WorkDelta) => void;
    isLoading?: boolean;
    className?: string;
    flex?: boolean;
}


const EditableTextField: React.FC<EditableTextFieldProps> = ({
    label,
    fieldKey,
    isEditModeOn,
    initialVersionContent,
    selectedWorkSubmission,
    workDeltaChanges,
    setWorkDeltaChanges,
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
        isEditModeOn,
        initialVersionContent,
        selectedWorkSubmission,
        workDeltaChanges,
        setWorkDeltaChanges,
    });

    const edit = isEditModeOn && selectedWorkSubmission.id !== 0;

    return (
        <div className={`${flex ? "flex items-center" : ""} font-semibold pt-2 ${className || ""}`}>
            <div className="flex items-center whitespace-nowrap">
                {label + ": "}
                {edit && (
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
                        {!edit ? (
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