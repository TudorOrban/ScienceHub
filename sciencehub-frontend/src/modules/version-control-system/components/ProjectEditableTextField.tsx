import { Skeleton } from "@/src/components/ui/skeleton";
import { ProjectDelta, ProjectSubmission } from "@/src/types/versionControlTypes";
import { useProjectEditableTextField } from "@/src/modules/version-control-system/hooks/useProjectEditableTextField";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ProjectEditableTextFieldProps {
    label?: string;
    fieldKey: string;
    initialVersionContent: string;
    isEditModeOn: boolean;
    selectedProjectSubmission: ProjectSubmission;
    projectDeltaChanges: ProjectDelta;
    setProjectDeltaChanges: (projectDeltaChanges: ProjectDelta) => void;
    isLoading?: boolean;
    className?: string;
    flex?: boolean;
}

/**
 * Component for an editable project field of type Text
 */
const ProjectEditableTextField: React.FC<ProjectEditableTextFieldProps> = ({
    label,
    fieldKey,
    isEditModeOn,
    initialVersionContent,
    selectedProjectSubmission,
    projectDeltaChanges,
    setProjectDeltaChanges,
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
    } = useProjectEditableTextField({
        fieldKey,
        isEditModeOn,
        initialVersionContent,
        selectedProjectSubmission,
        projectDeltaChanges,
        setProjectDeltaChanges,
    });

    const edit = isEditModeOn && selectedProjectSubmission?.id !== 0;

    return (
        <div className={`${flex ? "flex items-center" : ""} font-semibold pt-2 ${className || ""}`}>
            <div className="flex items-center whitespace-nowrap">
                {label + ": "}
                {edit && (
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

export default ProjectEditableTextField;
