import { useWorkEditModeContext } from "@/version-control-system/contexts/WorkEditModeContext";
import WorkSubmissionSelector from "@/text-editor/WorkSubmissionSelector";
import { useEffect, useState } from "react";
import useWorkGraph from "@/version-control-system/hooks/useWorkGraph";
import { useWorkSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useWorkSubmissionsSearch";
import { useWorkSubmissionData } from "@/hooks/fetch/data-hooks/management/useWorkSubmissionData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { constructIdentifier } from "@/utils/constructIdentifier";
import { handleSaveWorkDeltaChangesToSubmission } from "@/submit-handlers/version-control/handleSaveWorkDeltaChangesToSubmission";
import { useUpdateWorkDeltaFields } from "@/version-control-system/hooks/update/useUpdateWorkDeltaFields";
import { useToastsContext } from "@/contexts/general/ToastsContext";

interface WorkEditModeUIProps {}

/**
 * Edit Mode for works, establishing connection with version control
 */
const WorkEditModeUI: React.FC<WorkEditModeUIProps> = (props) => {
    // States
    const [isWorkGraphOpen, setIsWorkGraphOpen] = useState<boolean>();

    // Contexts
    const {
        isEditModeOn,
        workIdentifier,
        setWorkIdentifier,
        workSubmissions,
        setWorkSubmissions,
        selectedWorkSubmission,
        setSelectedWorkSubmission,
        selectedWorkSubmissionRefetch,
        setSelectedWorkSubmissionRefetch,
        workDeltaChanges,
        setWorkDeltaChanges,
    } = useWorkEditModeContext();

    // - Toasts
    const { setOperations } = useToastsContext();

    // Fetch work submissions of current workIdentifier
    const workSubmissionsData = useWorkSubmissionsSearch({
        extraFilters: {
            work_id: workIdentifier?.workId,
            work_type: workIdentifier?.workType,
        },
        context: "Reusable",
        enabled: isEditModeOn && !!workIdentifier?.workId,
    });

    useEffect(() => {
        if (workSubmissionsData.status === "success") {
            setWorkSubmissions(workSubmissionsData.data);
        }
    }, [workSubmissionsData.data]);

    // Fetch full data of current selected submission
    const fullWorkSubmissionData = useWorkSubmissionData(
        selectedWorkSubmission.id || 0,
        isEditModeOn && selectedWorkSubmission.id !== 0,
        true
    );

    useEffect(() => {
        if (fullWorkSubmissionData.status === "success") {
            setSelectedWorkSubmission(fullWorkSubmissionData.data[0]);
        }
    }, [fullWorkSubmissionData]);

    // useEffect(() => {
    //     if (fullWorkSubmissionData.refetch && !deepEqual(fullWorkSubmissionData.refetch, selectedWorkSubmissionRefetch)) {
    //         setSelectedWorkSubmissionRefetch(() => fullWorkSubmissionData.refetch);
    //     }
    // }, [fullWorkSubmissionData.refetch]);

    // Fetch work graph on demand
    const workGraphData = useWorkGraph(
        selectedWorkSubmission.id || 0,
        !!selectedWorkSubmission && selectedWorkSubmission.id !== 0 && isWorkGraphOpen
    );

    const submissionLink = `/${constructIdentifier(
        selectedWorkSubmission.users || [],
        selectedWorkSubmission.teams || []
    )}/management/submissions/${selectedWorkSubmission.id}`;

    const updateDelta = useUpdateWorkDeltaFields();

    return (
        <div className="w-full">
            <div
                className="flex justify-center sticky top-0 z-10 w-full h-6 bg-green-700 text-white border-y border-gray-500"
                style={{ fontWeight: 500 }}
            >
                Edit mode
            </div>
            <div className="w-full h-20 border-b border-gray-300 flex items-center justify-between p-4 rounded-lg shadow-md bg-gray-50 sticky top-6">
                <WorkSubmissionSelector
                    workSubmissions={workSubmissions}
                    selectedWorkSubmission={selectedWorkSubmission}
                    setSelectedWorkSubmission={setSelectedWorkSubmission}
                    setIsWorkGraphOpen={setIsWorkGraphOpen}
                />

                <div className="flex items-center space-x-2 ml-2">
                    <button
                        onClick={() =>
                            handleSaveWorkDeltaChangesToSubmission({
                                updateDelta,
                                selectedWorkSubmissionId: selectedWorkSubmission?.id,
                                workDeltaChanges: workDeltaChanges,
                                setWorkDeltaChanges,
                                setOperations,
                            })
                        }
                        className="flex items-center standard-write-button"
                    >
                        <FontAwesomeIcon icon={faSave} className="small-icon mr-1" />
                        Save
                    </button>
                    {selectedWorkSubmission.id !== 0 && (
                        <div className="standard-button hidden lg:inline-block" onClick={() => {}}>
                            Status: {selectedWorkSubmission.status}
                        </div>
                    )}
                    {selectedWorkSubmission.status === "In progress" && (
                        <Link href={submissionLink} className="standard-write-button">
                            Submit
                        </Link>
                    )}
                    {selectedWorkSubmission.status === "Submitted" && (
                        <Link href={submissionLink} className="standard-write-button">
                            Accept
                        </Link>
                    )}
                    {selectedWorkSubmission.status === "Accepted" && (
                        <Link href={submissionLink} className="standard-write-button">
                            View Submission
                        </Link>
                    )}
                </div>
            </div>
            {isWorkGraphOpen && (
                <div className="flex items-start w-full border-b border-gray-300">
                    {/* <ProjectVersionGraph
                        WorkGraph={
                            workGraphData.data.WorkGraph || {
                                id: 0,
                                WorkId: "0",
                                graphData: {},
                            }
                        }
                        selectedVersionId={
                            selectedWorkSubmission?.finalWorkVersionId?.toString() || "0"
                        }
                        handleSelectGraphNode={() => {}}
                        selectedSubmission={selectedWorkSubmission}
                        expanded={true}
                        className="h-32 w-full"
                    /> */}
                    {/* <button
                        className="bg-gray-50 border border-gray-300 text-gray-800 w-8 h-8 hover:bg-red-700 rounded-md shadow-sm justify-center"
                        onClick={() => setIsWorkGraphOpen(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} className="small-icon" />
                    </button> */}
                </div>
            )}
        </div>
    );
};

export default WorkEditModeUI;
