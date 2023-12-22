import { useProjectEditModeContext } from "@/version-control-system/contexts/ProjectEditModeContext";
import { useEffect, useState } from "react";
import useProjectGraph from "@/version-control-system/hooks/useProjectGraph";
import { useProjectSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import { useProjectSubmissionData } from "@/hooks/fetch/data-hooks/management/useProjectSubmissionData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { constructIdentifier } from "@/utils/constructIdentifier";
import { handleSaveProjectDeltaChangesToSubmission } from "@/submit-handlers/version-control/handleSaveProjectDeltaChangesToSubmission";
import { useUpdateProjectDeltaFields } from "@/hooks/update/useUpdateProjectDeltaFields";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import ProjectSubmissionSelector from "@/text-editor/ProjectSubmissionSelector";

interface ProjectEditModeUIProps {}

const ProjectEditModeUI: React.FC<ProjectEditModeUIProps> = (props) => {
    // States
    const [isProjectGraphOpen, setIsProjectGraphOpen] = useState<boolean>();

    // Contexts
    const {
        isProjectEditModeOn,
        projectId,
        setProjectId,
        setProjectSubmissions,
        projectName,
        selectedProjectSubmission,
        setSelectedProjectSubmission,
        selectedProjectSubmissionRefetch,
        setSelectedProjectSubmissionRefetch,
        projectDeltaChanges,
        setProjectDeltaChanges,
    } = useProjectEditModeContext();

    // - Toasts
    const { setOperations } = useToastsContext();

    // Fetch project submissions of current projectIdentifier
    const projectSubmissionsData = useProjectSubmissionsSearch({
        extraFilters: {
            project_id: projectId,
        },
        context: "Reusable",
        enabled: isProjectEditModeOn && !!projectId,
    });

    useEffect(() => {
        if (projectSubmissionsData.status === "success") {
            setProjectSubmissions(projectSubmissionsData.data);
        }
    }, [projectSubmissionsData.data]);
    
    // Fetch full data of current selected submission
    const fullProjectSubmissionData = useProjectSubmissionData(
        selectedProjectSubmission?.id || 0,
        isProjectEditModeOn && selectedProjectSubmission?.id !== 0,
        true
        );

    useEffect(() => {
        if (fullProjectSubmissionData.status === "success") {
            setSelectedProjectSubmission(fullProjectSubmissionData.data[0]);
        }
    }, [fullProjectSubmissionData]);

    // useEffect(() => {
    //     if (fullProjectSubmissionData.refetch && !deepEqual(fullProjectSubmissionData.refetch, selectedProjectSubmissionRefetch)) {
    //         setSelectedProjectSubmissionRefetch(() => fullProjectSubmissionData.refetch);
    //     }
    // }, [fullProjectSubmissionData.refetch]);

    // Fetch project graph on demand
    const projectGraphData = useProjectGraph(
        selectedProjectSubmission?.id || 0,
        !!selectedProjectSubmission && selectedProjectSubmission?.id !== 0 && isProjectGraphOpen
    );

    const submissionLink = `/${constructIdentifier(
        selectedProjectSubmission?.users || [],
        selectedProjectSubmission?.teams || []
    )}/projects/${projectName}/management/submissions/${selectedProjectSubmission?.id}`;
    // TODO: fetch project name

    const updateDelta = useUpdateProjectDeltaFields();

    return (
        <div className="w-full">
            <div
                className="flex justify-center sticky top-0 z-10 w-full h-6 bg-green-700 text-white border-y border-gray-500"
                style={{ fontWeight: 500 }}
            >
                Edit mode
            </div>
            <div className="w-full h-20 border-b border-gray-300 flex items-center justify-between p-4 rounded-lg shadow-md bg-gray-50 sticky top-6">
                <ProjectSubmissionSelector setIsProjectGraphOpen={setIsProjectGraphOpen} />

                <div className="flex items-center space-x-2 ml-2">
                    <button
                        onClick={() =>
                            handleSaveProjectDeltaChangesToSubmission({
                                updateDelta,
                                selectedProjectSubmissionId: selectedProjectSubmission?.id,
                                projectDeltaChanges: projectDeltaChanges,
                                setProjectDeltaChanges,
                                setOperations,
                            })
                        }
                        className="flex items-center standard-write-button"
                    >
                        <FontAwesomeIcon icon={faSave} className="small-icon mr-1" />
                        Save
                    </button>
                    {selectedProjectSubmission?.id !== 0 && (
                        <div className="standard-button hidden lg:inline-block" onClick={() => {}}>
                            Status: {selectedProjectSubmission?.status}
                        </div>
                    )}
                    {selectedProjectSubmission?.status === "In progress" && (
                        <Link href={submissionLink} className="standard-write-button">
                            Submit
                        </Link>
                    )}
                    {selectedProjectSubmission?.status === "Submitted" && (
                        <Link href={submissionLink} className="standard-write-button">
                            Accept
                        </Link>
                    )}
                    {selectedProjectSubmission?.status === "Accepted" && (
                        <Link href={submissionLink} className="standard-write-button">
                            View Submission
                        </Link>
                    )}
                </div>
            </div>
            MARKER
            {isProjectGraphOpen && (
                <div className="flex items-start w-full border-b border-gray-300">
                    {/* <ProjectVersionGraph
                        ProjectGraph={
                            projectGraphData.data.ProjectGraph || {
                                id: 0,
                                ProjectId: "0",
                                graphData: {},
                            }
                        }
                        selectedVersionId={
                            selectedProjectSubmission?.finalProjectVersionId?.toString() || "0"
                        }
                        handleSelectGraphNode={() => {}}
                        selectedSubmission={selectedProjectSubmission}
                        expanded={true}
                        className="h-32 w-full"
                    /> */}
                    {/* <button
                        className="bg-gray-50 border border-gray-300 text-gray-800 w-8 h-8 hover:bg-red-700 rounded-md shadow-sm justify-center"
                        onClick={() => setIsProjectGraphOpen(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} className="small-icon" />
                    </button> */}
                </div>
            )}
        </div>
    );
};

export default ProjectEditModeUI;
