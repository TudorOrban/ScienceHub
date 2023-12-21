import { faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { SelectOption } from "@/components/light-simple-elements/Select";
import { useEditorContext } from "@/contexts/general/EditorContext";
import { ProjectSubmissionSmall } from "@/types/versionControlTypes";
import SubmissionSelector from "./EditorProjectSubmissionSelector";
import { useState } from "react";
import useProjectGraph from "@/version-control-system/hooks/useProjectGraph";
import dynamic from "next/dynamic";
const ProjectVersionGraph = dynamic(
    () => import("@/components/visualizations/ProjectVersionGraph")
);

interface VersionControlPanelProps {}

const VersionControlPanel: React.FC<VersionControlPanelProps> = ({}) => {
    const {
        openedWorks,
        currentWindow,
        currentWork,
        projectSubmissions,
        setProjectSubmissions,
        selectedSubmission,
        setSelectedSubmission,
        openedProject,
    } = useEditorContext();

    const [isProjectGraphOpen, setIsProjectGraphOpen] = useState<boolean>(false);

    const projectGraphData = useProjectGraph(
        openedProject?.id || 0,
        !!openedProject && isProjectGraphOpen
    );

    // Save
    const handleSave = () => {
        try {
            if (!!openedWorks && !!currentWindow && !!currentWork) {
                const workToBeSaved = openedWorks[currentWindow][currentWork[currentWindow]];
            }
        } catch (error) {
            console.log("An error occurred: ", error);
        }
    };

    return (
        <>
            <div className="w-full h-16 border-b border-gray-300 flex items-center justify-between p-4 rounded-md shadow-md bg-gray-100">
                {/* <input
                    type="text"
                    // value={localInputQuery}
                    // onChange={handleInputChange}
                    placeholder={"Type command"}
                    className="border w-60 p-2 my-3 rounded"
                    style={{ height: "40px" }}
                /> */}
                <SubmissionSelector setIsProjectGraphOpen={setIsProjectGraphOpen} />
                <div className="flex items-center">
                    <button
                        className="bg-white border border-gray-200 rounded-md shadow-sm p-2 mr-2 h-10  hover:bg-gray-100 font-semibold text-sm"
                        onClick={() => {}}
                    >
                        View Changes
                    </button>
                    <button
                        onClick={handleSave || (() => {})}
                        className="flex items-center px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 font-semibold text-white border border-gray-300 rounded-md"
                    >
                        <FontAwesomeIcon icon={faSave} className="small-icon text-white mr-1" />
                        Save
                    </button>
                </div>
            </div>
            {isProjectGraphOpen && (
                <div className="flex items-start w-full border-b border-gray-300">
                    <ProjectVersionGraph
                        projectGraph={
                            projectGraphData.data[0] || {
                                id: 0,
                                projectId: "0",
                                graphData: {},
                            }
                        }
                        selectedVersionId={
                            selectedSubmission?.finalProjectVersionId?.toString() || "0"
                        }
                        handleSelectGraphNode={() => {}}
                        selectedSubmission={selectedSubmission}
                        expanded={true}
                        className="h-32 w-full"
                    />
                    <button
                        className="bg-gray-50 border border-gray-300 text-gray-800 w-8 h-8 hover:bg-red-700 rounded-md shadow-sm justify-center"
                        onClick={() => setIsProjectGraphOpen(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} className="small-icon" />
                    </button>
                </div>
            )}
        </>
    );
};

export default VersionControlPanel;
