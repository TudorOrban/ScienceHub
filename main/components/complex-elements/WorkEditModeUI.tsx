import { useWorkEditModeContext } from "@/contexts/search-contexts/version-control/WorkEditModeContext";
import WorkSubmissionSelector from "@/text-editor/WorkSubmissionSelector";
import { useEffect, useState } from "react";
import useWorkGraph from "@/version-control-system/hooks/useWorkGraph";
import { useWorkSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useWorkSubmissionsSearch";
import { useWorkSubmissionData } from "@/hooks/fetch/data-hooks/management/useWorkSubmissionData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { constructIdentifier } from "@/utils/constructIdentifier";

interface WorkEditModeUIProps {}

const WorkEditModeUI: React.FC<WorkEditModeUIProps> = (props) => {
    const [isWorkGraphOpen, setIsWorkGraphOpen] = useState<boolean>();

    const {
        isEditModeOn,
        workIdentifier,
        setWorkIdentifier,
        setWorkSubmissions,
        selectedWorkSubmission,
        setSelectedWorkSubmission,
        setSelectedWorkSubmissionRefetch,
    } = useWorkEditModeContext();

    // Fetch work submissions of current workIdentifier
    const workSubmissionsData = useWorkSubmissionsSearch({
        extraFilters: {
            work_id: workIdentifier?.workId,
            work_type: "Dataset",
        },
        context: "Reusable",
        enabled: isEditModeOn && !!workIdentifier?.workId,
    });

    useEffect(() => {
        if (workSubmissionsData.status === "success") {
            setWorkSubmissions(workSubmissionsData.data);
            setSelectedWorkSubmissionRefetch?.(workSubmissionsData.refetch || (() => {}));
        }
    }, [workSubmissionsData.data]);

    // Fetch full data of current selected submission
    const fullWorkSubmissionData = useWorkSubmissionData(
        selectedWorkSubmission.id || 0,
        isEditModeOn && !!selectedWorkSubmission.id && selectedWorkSubmission.id !== 0,
        true
    );

    useEffect(() => {
        if (fullWorkSubmissionData.status === "success") {
            setSelectedWorkSubmission(fullWorkSubmissionData.data[0]);
        }
    }, [fullWorkSubmissionData]);

    // Fetch work graph on demand
    const workGraphData = useWorkGraph(
        selectedWorkSubmission.id || 0,
        !!selectedWorkSubmission && selectedWorkSubmission.id !== 0 && isWorkGraphOpen
    );

    const submissionLink = `/${constructIdentifier(
        selectedWorkSubmission.users || [],
        selectedWorkSubmission.teams || []
    )}/management/submissions/${selectedWorkSubmission.id}`;

    return (
        <div className="w-full">
            <div
                className="flex justify-center sticky top-0 z-10 w-full h-6 bg-green-700 text-white border-y border-gray-500"
                style={{ fontWeight: 500 }}
            >
                Edit mode
            </div>
            <div className="w-full h-20 border-b border-gray-300 flex items-center justify-between p-4 rounded-lg shadow-md bg-gray-50 sticky top-6">
                {/* <input
                    type="text"
                    // value={localInputQuery}
                    // onChange={handleInputChange}
                    placeholder={"Type command"}
                    className="border w-80 p-2 my-3 rounded"
                    style={{ height: "40px" }}
                /> */}
                <WorkSubmissionSelector setIsWorkGraphOpen={setIsWorkGraphOpen} />

                <div className="flex items-center space-x-2">
                    <div
                        className="bg-white border border-gray-200 rounded-md shadow-sm p-2 mr-2 h-10 hover:bg-gray-100 font-semibold text-sm"
                        onClick={() => {}}
                    >
                        Status: {selectedWorkSubmission.status}
                    </div>
                    {selectedWorkSubmission.status === "In progress" && (
                        <Link
                            href={submissionLink}
                            className="px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 font-semibold text-white border border-gray-300 rounded-md"
                        >
                            Submit
                        </Link>
                    )}
                    {selectedWorkSubmission.status === "Submitted" && (
                        <Link
                            href={submissionLink}
                            className="px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 font-semibold text-white border border-gray-300 rounded-md"
                        >
                            Submit
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
