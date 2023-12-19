import { Skeleton } from "@/components/ui/skeleton";
import { WorkSubmission } from "@/types/versionControlTypes";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEditableTextArrayField } from "../hooks/useEditableTextArrayField";

interface EditableTextArrayFieldProps {
    label?: string;
    fieldKey: string;
    initialVersionContents: string[];
    isEditModeOn: boolean;
    selectedWorkSubmission: WorkSubmission;
    isMetadataField?: boolean;
    isLoading?: boolean;
    className?: string;
    flex?: boolean;
}

const EditableTextArrayField: React.FC<EditableTextArrayFieldProps> = ({
    label,
    fieldKey,
    initialVersionContents,
    isEditModeOn,
    selectedWorkSubmission,
    isMetadataField,
    isLoading,
    className,
    flex,
}) => {
    const {
        isTextFieldEditable,
        currentContents,
        editedContents,
        setEditedContents,
        handleAddContent,
        toggleEditState,
    } = useEditableTextArrayField({
        fieldKey,
        initialVersionContents,
        selectedWorkSubmission,
        isEditModeOn,
        isMetadataField,
    });

    return (
        <div className={`${flex ? "flex items-center" : ""} font-semibold pt-2 ${className || ""}`}>
            <div className="whitespace-nowrap">{label + ": "}</div>
            {!isLoading ? (
                <div className="flex items-center flex-wrap text-gray-700 font-normal text-sm">
                    {(currentContents || []).map((currentContent, index) => (
                        <div
                            key={`${currentContent}-${index}`}
                            className="flex items-center p-1 ml-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                        >
                            {!isEditModeOn ? (
                                <p>{currentContent}</p>
                            ) : !isTextFieldEditable[index] ? (
                                <p>{currentContents[index]}</p>
                            ) : (
                                <textarea
                                    id="textField"
                                    value={editedContents[index]}
                                    onChange={(e) => {
                                        const updatedContents = [...editedContents];
                                        updatedContents[index] = e.target.value;
                                        setEditedContents(updatedContents);
                                    }}
                                    className="w-full focus:outline-none"
                                />
                            )}
                            {isEditModeOn && (
                                <button className="ml-2" onClick={toggleEditState}>
                                    <FontAwesomeIcon
                                        icon={faPen}
                                        className="small-icon text-gray-700 hover:text-gray-900"
                                    />
                                </button>
                            )}
                        </div>
                    ))}
                    {isEditModeOn && (
                        <button onClick={handleAddContent} className="flex items-center justify-center ml-2 w-5 h-5 bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="text-gray-700 hover:text-gray-900 w-3 h-3"
                            />
                        </button>
                    )}
                </div>
            ) : (
                <Skeleton className="w-full h-6 bg-gray-400 m-2" />
            )}
        </div>
    );
};

export default EditableTextArrayField;
