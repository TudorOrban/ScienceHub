import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useWorkEditModeContext } from "@/contexts/search-contexts/version-control/WorkEditModeContext";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { computeTextDiff } from "@/version-control-system/computeTextDiff";
import { WorkDelta, WorkSubmission, WorkTextFieldsDiffs } from "@/types/versionControlTypes";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";

interface EditableTextFieldBoxProps {
    label?: string;
    fieldKey: string;
    initialVersionContent: string;
    isEditModeOn: boolean;
    selectedWorkSubmission: WorkSubmission;
    isLoading?: boolean;
    className?: string;
}

const EditableTextFieldBox: React.FC<EditableTextFieldBoxProps> = ({
    label,
    fieldKey,
    initialVersionContent,
    isEditModeOn,
    selectedWorkSubmission,
    isLoading,
    className,
}) => {
    const [isTextFieldEditable, setIsTextFieldEditable] = useState<boolean>(false);
    const [currentContent, setCurrentContent] = useState<string>();
    const [editedContent, setEditedContent] = useState<string>(initialVersionContent);

    // Reconstruct final version content form initial version content and selected submission's work delta
    useEffect(() => {
        if (isEditModeOn && !!selectedWorkSubmission && selectedWorkSubmission.id !== 0) {
            const correspondingDiffs =
                selectedWorkSubmission.workDelta?.textDiffs?.[fieldKey as keyof WorkTextFieldsDiffs];

            setCurrentContent(applyTextDiffs(initialVersionContent, correspondingDiffs || []));
        }
    }, [isEditModeOn, selectedWorkSubmission]);

    // Upon closing text area, compute diffs against initial version content and save to database
    const updateSubmission = useUpdateGeneralData();

    const handleSaveToSubmission = () => {
        try {
            if (
                !!selectedWorkSubmission &&
                selectedWorkSubmission.id !== 0 &&
                initialVersionContent !== editedContent
            ) {
                const textDiffs = computeTextDiff(initialVersionContent, editedContent);

                const updatedSubmission = updateSubmission.mutateAsync({
                    tableName: "work_submissions",
                    identifierField: "id",
                    identifier: selectedWorkSubmission.id,
                    updateFields: {
                        work_delta: {
                            textDiffs: {
                                [fieldKey]: textDiffs,
                            },
                        },
                    },
                });

                setCurrentContent(editedContent);
                setIsTextFieldEditable(false);
            }
        } catch (error) {
            console.log("An error occurred while saving: ", error);
        }
    };

    return (
        <div className={`border rounded-lg shadow-md ${className || ""}`}>
            <div
                className="text-gray-900 text-lg font-semibold py-2 px-4 rounded-t-lg border-b border-gray-200"
                style={{
                    backgroundColor: "var(--page-header-bg-color)",
                    fontWeight: "500",
                    fontSize: "18px",
                }}
            >
                {label || ""}
                {isEditModeOn && (
                    <button
                        className="ml-4"
                        onClick={() => {
                            if (!isTextFieldEditable) {
                                setEditedContent(currentContent || "");
                                setIsTextFieldEditable(true);
                            } else {
                                handleSaveToSubmission();
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faPen} className="small-icon text-gray-700" />
                    </button>
                )}
            </div>

            <div className="px-4 py-2 break-words">
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

export default EditableTextFieldBox;
