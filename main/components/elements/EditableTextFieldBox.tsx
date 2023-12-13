import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

interface EditableTextFieldBoxProps {
    label?: string;
    content?: string;
    isLoading?: boolean;
    className?: string;
    isEditModeOn?: boolean;
    editedContent?: string;
    setEditedContent?: (editedContent: string) => void;
}

const EditableTextFieldBox: React.FC<EditableTextFieldBoxProps> = ({
    label,
    content,
    isLoading,
    className,
    isEditModeOn,
    editedContent,
    setEditedContent,
}) => {
    const [isTextFieldEditable, setIsTextFieldEditable] = useState<boolean>(false);
    const useEditMode = isEditModeOn !== undefined && setEditedContent !== undefined;

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
                    <button className="ml-4" onClick={() => setIsTextFieldEditable(!isTextFieldEditable)}>
                        <FontAwesomeIcon icon={faPen} className="small-icon text-gray-700" />
                    </button>
                )}
            </div>

            <div className="px-4 py-2 break-words">
                {!isLoading ? (
                    <>
                        {!isEditModeOn ? (
                            content
                        ) : !isTextFieldEditable ? (
                            <div>{editedContent}</div>
                        ) : (
                            <textarea id="textField" value={useEditMode ? editedContent : content} onChange={useEditMode ? (e => setEditedContent?.(e.target.value)) : (() => {})} className="w-full focus:outline-none"/>
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
