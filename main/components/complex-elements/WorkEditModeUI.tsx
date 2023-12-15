import { useWorkEditModeContext } from "@/app/contexts/search-contexts/version-control/WorkEditModeContext";
import WorkSubmissionSelector from "@/app/text-editor/WorkSubmissionSelector";
import { useEffect, useState } from "react";
import useWorkGraph from "@/app/version-control-system/hooks/useWorkGraph";
import { useWorkSubmissionsSearch } from "@/app/hooks/fetch/search-hooks/submissions/useWorkSubmissionsSearch";
import { useWorkSubmissionData } from "@/app/hooks/fetch/data-hooks/management/useWorkSubmissionData";
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

    const submitLink = `/${constructIdentifier(selectedWorkSubmission.users || [], selectedWorkSubmission.teams || [])}/manage/submissions/${selectedWorkSubmission.id}/submit`; 

    return (
        <div className="w-full">
            <div className="flex justify-center w-full h-6 bg-green-700 text-white border-t border-gray-500 sticky top-0 z-10">
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
                    <button
                        className="bg-white border border-gray-200 rounded-md shadow-sm p-2 mr-2 h-10 hover:bg-gray-100 font-semibold text-sm"
                        onClick={() => {}}
                    >
                        View Submission
                    </button>
                    <Link
                        href={submitLink}
                        className="flex items-center px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 font-semibold text-white border border-gray-300 rounded-md"
                    >
                        <FontAwesomeIcon icon={faSave} className="small-icon text-white md:mr-1" />
                        <div className="hidden md:inline-block">Submit</div>
                    </Link>
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
