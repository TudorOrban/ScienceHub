import { Skeleton } from "@/src/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { ProjectDelta, ProjectSubmission } from "@/src/types/versionControlTypes";
import { useProjectEditableTextField } from "@/src/modules/version-control-system/hooks/useProjectEditableTextField";
import { useEffect, useRef } from "react";
import { DisplayTextWithNewLines } from "@/src/components/light-simple-elements/TextWithLines";

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

/**
 * Component for an editable project field box of type Text
 */
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
        <div className={`w-full border border-gray-300 rounded-lg shadow-md ${className || ""}`}>
            <div
                className="text-gray-900 text-lg font-semibold py-2 px-4 rounded-t-lg border-b border-gray-300"
                style={{
                    backgroundColor: "var(--box-header-bg-color)",
                    fontWeight: "500",
                    fontSize: "18px",
                }}
            >
                {label || ""}
                {edit && (
                    <button className="ml-4" onClick={toggleEditState}>
                        <FontAwesomeIcon icon={faPen} className="small-icon text-gray-700" />
                    </button>
                )}
            </div>

            <div className="px-4 py-2 break-words">
                {!isLoading ? (
                    <>
                        {!edit ? (
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

export default ProjectEditableTextFieldBox;
