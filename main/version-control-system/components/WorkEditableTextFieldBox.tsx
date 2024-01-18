import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { WorkDelta, WorkSubmission } from "@/types/versionControlTypes";
import { useWorkEditableTextField } from "@/version-control-system/hooks/useWorkEditableTextField";
import { useEffect, useRef } from "react";
import { DisplayTextWithNewLines } from "@/components/light-simple-elements/TextWithLines";

interface WorkEditableTextFieldBoxProps {
    label?: string;
    fieldKey: string;
    initialVersionContent: string;
    isEditModeOn: boolean;
    selectedWorkSubmission: WorkSubmission;
    workDeltaChanges: WorkDelta;
    setWorkDeltaChanges: (workDeltaChanges: WorkDelta) => void;
    isLoading?: boolean;
    className?: string;
}

const WorkEditableTextFieldBox: React.FC<WorkEditableTextFieldBoxProps> = ({
    label,
    fieldKey,
    initialVersionContent,
    isEditModeOn,
    selectedWorkSubmission,
    workDeltaChanges,
    setWorkDeltaChanges,
    isLoading,
    className,
}) => {
    const {
        isTextFieldEditable,
        currentContent,
        editedContent,
        setEditedContent,
        toggleEditState,
    } = useWorkEditableTextField({
        fieldKey,
        initialVersionContent,
        selectedWorkSubmission,
        workDeltaChanges,
        setWorkDeltaChanges,
        isEditModeOn,
    });

    const edit = isEditModeOn && selectedWorkSubmission.id !== 0;

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
        <div className={`border border-gray-300 rounded-lg shadow-md ${className || ""}`}>
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
                            <DisplayTextWithNewLines text={initialVersionContent}/>
                        ) : !isTextFieldEditable ? (
                            <DisplayTextWithNewLines text={currentContent}/>
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

export default WorkEditableTextFieldBox;
