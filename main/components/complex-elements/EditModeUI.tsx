import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface EditModeUIProps {
    isEditModeOn: boolean;
    toggleEditMode: () => void;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedSubmission: number;
    submissionsIds: number[];
    submissionInitialProjectVersion: string;
    submissionFinalProjectVersion: string;
    handleSave: () => Promise<void>;
}

const EditModeUI: React.FC<EditModeUIProps> = (props) => {
    const {
        isEditModeOn,
        toggleEditMode,
        handleChange,
        selectedSubmission,
        submissionsIds,
        submissionInitialProjectVersion,
        submissionFinalProjectVersion,
        handleSave,
    } = props;

    const handleSelectChange = (value: string) => {
        // Creating an event object to pass it to handleChange
        const event = {
            target: { value },
        } as React.ChangeEvent<HTMLSelectElement>;
        handleChange(event);
    };

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
                    className="border w-80 p-2 my-3 rounded"
                    style={{ height: "40px" }}
                />
                <div className="flex items-center mx-4 text-sm font-semibold text-gray-700">
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
                            {/* <SelectItem value="">Select your option</SelectItem> */}
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
                </div>

                {submissionInitialProjectVersion &&
                    submissionFinalProjectVersion && (
                        <div className="text-sm text-gray-600 mx-4">
                            <div className="">
                                Initial version ID:{" "}
                                {submissionInitialProjectVersion}
                            </div>
                            <div>
                                Final version ID:{" "}
                                {submissionFinalProjectVersion}
                            </div>
                        </div>
                    )}

                {isEditModeOn && (
                    <div className="">
                        <button
                            className="bg-blue-600 text-white p-2 mx-4 rounded-md focus:outline-none focus:ring-2 hover:bg-blue-700"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditModeUI;
