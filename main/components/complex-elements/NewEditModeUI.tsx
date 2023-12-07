import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { SelectOption } from "../light-simple-elements/Select";
import { useEditorContext } from "@/app/contexts/general/EditorContext";

interface VersionControlPanelProps {
    projectSubmissions: SelectOption[];
    submissionInitialProjectVersion: string;
    submissionFinalProjectVersion: string;
    // handleSave: () => Promise<void>;
    handleSave: () => void;
}

const VersionControlPanel: React.FC<VersionControlPanelProps> = ({
    projectSubmissions,
    submissionInitialProjectVersion,
    submissionFinalProjectVersion,
    handleSave,
}) => {
    const { selectedSubmission, setSelectedSubmission } = useEditorContext();

    return (
        <div className="w-full">
            <div className="flex justify-center w-full h-6 bg-green-700 text-white border-t border-gray-500 sticky top-0 z-10">
                Edit mode
            </div>
            <div className="w-full h-20 border-b border-gray-300 flex items-center p-4 rounded-lg shadow-md bg-gray-50 sticky top-6">
                <input
                    type="text"
                    // value={localInputQuery}
                    // onChange={handleInputChange}
                    placeholder={"Type command"}
                    className="border w-60 p-2 my-3 rounded"
                    style={{ height: "40px" }}
                />
                <Select
                    selectOptions={projectSubmissions}
                    currentSelection={selectedSubmission || {}}
                    setCurrentSelection={setSelectedSubmission || (() => {})}
                    className="w-32"
                />
                {/* <div className="flex items-center mx-4 text-sm font-semibold text-gray-700">
                    <Select
                        onValueChange={handleSelectChange}
                        value={selectedSubmission.toString()}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue
                                placeholder="Select submission"
                                className="text-black"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="create_new">
                                Create Submission
                            </SelectItem>
                            <div className="overflow-y-auto h-[200px]">
                                {submissionsIds.map((id) => (
                                    <SelectItem key={id} value={id.toString()}>
                                        {`Submission ${id}`}
                                    </SelectItem>
                                ))}
                            </div>
                        </SelectContent>
                    </Select>
                </div> */}

                {submissionInitialProjectVersion && submissionFinalProjectVersion && (
                    <div className="text-sm text-gray-600 mx-4">
                        <div className="">
                            Initial version ID: {submissionInitialProjectVersion}
                        </div>
                        <div>Final version ID: {submissionFinalProjectVersion}</div>
                    </div>
                )}

                <button
                    onClick={handleSave || (() => {})}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 font-semibold text-white border border-gray-300 rounded-md"
                >
                    <FontAwesomeIcon icon={faSave} className="small-icon text-white mr-1" />
                    Save
                </button>
            </div>
        </div>
    );
};

export default VersionControlPanel;
