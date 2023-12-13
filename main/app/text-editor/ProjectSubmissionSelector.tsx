import React, { useEffect, useRef, useState } from "react";
import { useEditorContext } from "../contexts/general/EditorContext";
import { ProjectSubmissionSmall } from "@/types/versionControlTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faCheck } from "@fortawesome/free-solid-svg-icons";

interface SubmissionSelectorProps {
    className?: string;
    setIsProjectGraphOpen: (isProjectGraphOpen: boolean) => void;
}

const SubmissionSelector: React.FC<SubmissionSelectorProps> = ({ className, setIsProjectGraphOpen }) => {
    // Editor context
    const {
        projectSubmissions,
        setProjectSubmissions,
        selectedSubmission,
        setSelectedSubmission,
    } = useEditorContext();

    // States
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [tempSubmission, setTempSubmission] = useState<ProjectSubmissionSmall | undefined>(selectedSubmission);

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

    const handleSelect = (submission: ProjectSubmissionSmall) => {
        setTempSubmission(submission);
        setIsOpen(false);
    };

    const handleSelectSubmission = () => {
        if (!!tempSubmission) {
            setSelectedSubmission(tempSubmission);
        }
    }

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
                        {tempSubmission?.title || selectedSubmission?.title || "No title"}
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
                            {"Select Project Submission"}
                        </div>
                        <button
                            onClick={() => setIsProjectGraphOpen(true)}
                            className=" text-blue-600"
                        >
                            {"View Project Graph"}
                        </button>
                        {projectSubmissions?.map((submission) => (
                            <div key={submission.id} className="w-full z-400">
                                <button
                                    className={`flex items-center justify-between h-8 w-full ${
                                        submission.id === selectedSubmission?.id
                                            ? "bg-gray-200"
                                            : ""
                                    }`}
                                    onClick={() => handleSelect(submission)}
                                >
                                    <span className="flex whitespace-nowrap text-ellipsis overflow-hidden">
                                        {submission.title}
                                    </span>
                                    {submission.id === selectedSubmission?.id && (
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
            <button onClick={handleSelectSubmission} className="bg-white border border-gray-200 hover:bg-gray-50 rounded-md shadow-sm p-2 mr-2 h-10 font-semibold text-sm">
                Select Submission
            </button>
            <div>
                <div className="flex items-center text-sm">
                    <div className="font-semibold mr-1">{"Initial Version: "}</div>
                    {selectedSubmission?.initialProjectVersionId}
                </div>
                <div className="flex items-center text-sm">
                    <div className="font-semibold mr-1">{"Final Version: "}</div>
                    {selectedSubmission?.finalProjectVersionId}
                </div>
            </div>
        </div>
    );
};

export default SubmissionSelector;
