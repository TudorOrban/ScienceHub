import { Skeleton } from "@/src/components/ui/skeleton";
import { ProjectDelta, ProjectSubmission } from "@/src/types/versionControlTypes";
import { faPen, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useProjectEditableTextArrayField } from "../hooks/useProjectEditableTextArrayField";

interface ProjectEditableTextArrayFieldProps {
    label?: string;
    fieldKey: string;
    isEditModeOn: boolean;
    initialVersionContents: string[];
    selectedProjectSubmission: ProjectSubmission;
    projectDeltaChanges: ProjectDelta;
    setProjectDeltaChanges: (projectDeltaChanges: ProjectDelta) => void;
    isLoading?: boolean;
    className?: string;
    flex?: boolean;
}

/**
 * Component for an editable project field of type TextArray
 */
const ProjectEditableTextArrayField: React.FC<ProjectEditableTextArrayFieldProps> = ({
    label,
    fieldKey,
    isEditModeOn,
    initialVersionContents,
    selectedProjectSubmission,
    projectDeltaChanges,
    setProjectDeltaChanges,
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
        handleRemoveContent,
        toggleEditState,
    } = useProjectEditableTextArrayField({
        fieldKey,
        isEditModeOn,
        initialVersionContents,
        selectedProjectSubmission,
        projectDeltaChanges,
        setProjectDeltaChanges,
    });

    const edit = isEditModeOn && selectedProjectSubmission?.id !== 0;

    return (
        <div className={`${flex ? "flex items-center" : ""} font-semibold pt-2 ${className || ""}`}>
            <div className="whitespace-nowrap mb-1">{label + ": "}</div>
            {!isLoading ? (
                <div className="flex items-center flex-wrap text-gray-700 font-normal text-sm">
                    {(currentContents || []).map((currentContent, index) => (
                        <div
                            key={`${currentContent}-${index}`}
                            className="flex items-center p-1 ml-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                        >
                            {!edit ? (
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
                            {edit && (
                                <button className="ml-2" onClick={() => toggleEditState(index)}>
                                    <FontAwesomeIcon
                                        icon={faPen}
                                        className="small-icon text-gray-700 hover:text-gray-900"
                                    />
                                </button>
                            )}
                            {edit && (
                                <button className="ml-2" onClick={() => handleRemoveContent(index)}>
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        className="small-icon text-gray-700 hover:text-red-700"
                                    />
                                </button>
                            )}
                        </div>
                    ))}
                    {edit && (
                        <button
                            onClick={handleAddContent}
                            className="flex items-center justify-center ml-2 w-5 h-5 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                        >
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

export default ProjectEditableTextArrayField;
