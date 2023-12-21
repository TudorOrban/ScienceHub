import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { ProjectDelta, ProjectSubmission } from "@/types/versionControlTypes";
import { useProjectEditableTextField } from "@/version-control-system/hooks/useProjectEditableTextField";

interface ProjectEditableTextFieldBoxProps {
    label?: string;
    fieldKey: string;
    initialVersionContent: string;
    isEditModeOn: boolean;
    selectedProjectSubmission: ProjectSubmission;
    projectDeltaChanges: ProjectDelta;
    setProjectDeltaChanges: (projectDeltaChanges: ProjectDelta) => void;
    isLoading?: boolean;
    className?: string;
}

const ProjectEditableTextFieldBox: React.FC<ProjectEditableTextFieldBoxProps> = ({
    label,
    fieldKey,
    initialVersionContent,
    isEditModeOn,
    selectedProjectSubmission,
    projectDeltaChanges,
    setProjectDeltaChanges,
    isLoading,
    className,
}) => {
    const {
        isTextFieldEditable,
        currentContent,
        editedContent,
        setEditedContent,
        toggleEditState,
    } = useProjectEditableTextField({
        fieldKey,
        initialVersionContent,
        selectedProjectSubmission,
        projectDeltaChanges,
        setProjectDeltaChanges,
        isEditModeOn,
    });

    const edit = isEditModeOn && selectedProjectSubmission?.id !== 0;

    return (
        <div className={`border border-gray-300 rounded-lg shadow-md ${className || ""}`}>
            <div
                className="text-gray-900 text-lg font-semibold py-2 px-4 rounded-t-lg border-b border-gray-300"
                style={{
                    backgroundColor: "var(--page-header-bg-color)",
                    fontWeight: "500",
                    fontSize: "18px",
                }}
            >
                {label || ""}
                {edit && (
                    <button
                        className="ml-4"
                        onClick={toggleEditState}
                    >
                        <FontAwesomeIcon icon={faPen} className="small-icon text-gray-700" />
                    </button>
                )}
            </div>

            <div className="px-4 py-2 break-words">
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

export default ProjectEditableTextFieldBox;
