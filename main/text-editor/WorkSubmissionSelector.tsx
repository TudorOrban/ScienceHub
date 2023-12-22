import React, { useEffect, useRef, useState } from "react";
import { useEditorContext } from "@/contexts/general/EditorContext";
import { WorkSubmission, WorkSubmissionSmall } from "@/types/versionControlTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useWorkEditModeContext } from "@/version-control-system/contexts/WorkEditModeContext";

interface WorkSubmissionSelectorProps {
    workSubmissions: WorkSubmissionSmall[];
    selectedWorkSubmission: WorkSubmission;
    setSelectedWorkSubmission: (selectedWorkSubmission: WorkSubmission) => void;
    className?: string;
    setIsWorkGraphOpen: (isWorkGraphOpen: boolean) => void;
}

const WorkSubmissionSelector: React.FC<WorkSubmissionSelectorProps> = ({
    workSubmissions,
    selectedWorkSubmission,
    setSelectedWorkSubmission,
    className,
    setIsWorkGraphOpen,
}) => {
    // States
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [tempSubmission, setTempSubmission] = useState<WorkSubmissionSmall | undefined>(
        selectedWorkSubmission
    );

    // Close the dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        // Bind the event listener
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (submission: WorkSubmissionSmall) => {
        setTempSubmission(submission);
        setIsOpen(false);
    };

    const handleSelectSubmission = () => {
        if (!!tempSubmission) {
            setSelectedWorkSubmission(tempSubmission as WorkSubmission);
        }
    };

    return (
        <div className="flex items-center relative z-40">
            <div
                className={`bg-white text-gray-900 border border-gray-200 text-base rounded-md mr-2 ${
                    className || ""
                }`}
                style={{ fontSize: "15px", lineHeight: "20px", fontWeight: 500 }}
                ref={wrapperRef}
            >
                <button
                    className="flex items-center justify-between px-2 py-1 w-32 h-10 whitespace-nowrap"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="text-ellipsis overflow-hidden">
                        {tempSubmission?.title || selectedWorkSubmission?.title || "No title"}
                    </div>
                    <div className="flex items-end">
                        <FontAwesomeIcon
                            icon={isOpen ? faCaretUp : faCaretDown}
                            className="small-icon text-gray-700 ml-2"
                        />
                    </div>
                </button>
                {isOpen && (
                    <div className="absolute left-0 top-12 z-40 space-y-1 px-2 w-56 h-64 overflow-y-auto overflow-x-hidden bg-white border border-gray-200 rounded-md shadow-md">
                        <div className="font-semibold flex whitespace-nowrap py-1">
                            {"Select Work Submission"}
                        </div>
                        <button onClick={() => setIsWorkGraphOpen(true)} className=" text-blue-600">
                            {"View Work Graph"}
                        </button>
                        {workSubmissions?.map((submission) => (
                            <div key={submission.id} className="w-full z-400">
                                <button
                                    className={`flex items-center justify-between h-8 w-full ${
                                        submission.id === selectedWorkSubmission?.id
                                            ? "bg-gray-200"
                                            : ""
                                    }`}
                                    onClick={() => handleSelect(submission as WorkSubmissionSmall)}
                                >
                                    <span className="flex whitespace-nowrap text-ellipsis overflow-hidden">
                                        {submission.title}
                                    </span>
                                    {submission.id === selectedWorkSubmission?.id && (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className="small-icon text-gray-700 ml-4 mr-1"
                                        />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={handleSelectSubmission} className="standard-button mr-2">
                Select Submission
            </button>
            <div className="hidden md:inline-block">
                <div className="flex items-center text-sm">
                    <div className="font-semibold mr-1">{"Initial Version: "}</div>
                    {selectedWorkSubmission?.initialWorkVersionId}
                </div>
                <div className="flex items-center text-sm">
                    <div className="font-semibold mr-1">{"Final Version: "}</div>
                    {selectedWorkSubmission?.finalWorkVersionId}
                </div>
            </div>
        </div>
    );
};

export default WorkSubmissionSelector;
