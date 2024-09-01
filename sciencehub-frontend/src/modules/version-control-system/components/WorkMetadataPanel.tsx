import { WorkDelta, WorkSubmission } from "@/src/types/versionControlTypes";
import { WorkMetadata } from "@/src/types/workTypes";
import WorkEditableTextField from "./WorkEditableTextField";
import WorkEditableTextArrayField from "./WorkEditableTextArrayField";

interface WorkPanelProps {
    metadata: WorkMetadata;
    isEditModeOn: boolean;
    selectedWorkSubmission: WorkSubmission;
    workDeltaChanges: WorkDelta;
    setWorkDeltaChanges: (workDeltaChanges: WorkDelta) => void;
    isLoading?: boolean;
}

/**
 * Panel for Work Metadata, using editable text fields and Edit Mode
 */
const WorkMetadataPanel: React.FC<WorkPanelProps> = ({
    metadata,
    isEditModeOn,
    selectedWorkSubmission,
    workDeltaChanges,
    setWorkDeltaChanges,
    isLoading,
}) => {
    return (
        <div
            className="flex-shrink-0 p-4 border border-gray-300 shadow-md h-full"
            style={{ width: "250px" }}
        >
            <div className="font-semibold text-xl text-black">Metadata</div>
            <WorkEditableTextField
                label="License"
                fieldKey="license"
                isEditModeOn={isEditModeOn}
                initialVersionContent={metadata?.license || ""}
                selectedWorkSubmission={selectedWorkSubmission}
                workDeltaChanges={workDeltaChanges}
                setWorkDeltaChanges={setWorkDeltaChanges}
                isLoading={isLoading}
                className="w-full m-2"
            />
            <WorkEditableTextField
                label="Publisher"
                fieldKey="publisher"
                initialVersionContent={metadata?.publisher || ""}
                isEditModeOn={isEditModeOn}
                selectedWorkSubmission={selectedWorkSubmission}
                workDeltaChanges={workDeltaChanges}
                setWorkDeltaChanges={setWorkDeltaChanges}
                isLoading={isLoading}
                className="w-full m-2"
            />
            <WorkEditableTextField
                label="Conference"
                fieldKey="conference"
                initialVersionContent={metadata?.conference || ""}
                isEditModeOn={isEditModeOn}
                selectedWorkSubmission={selectedWorkSubmission}
                workDeltaChanges={workDeltaChanges}
                setWorkDeltaChanges={setWorkDeltaChanges}
                isLoading={isLoading}
                className="w-full m-2"
            />
            <WorkEditableTextArrayField
                label="Keywords"
                fieldKey="keywords"
                initialVersionContents={metadata?.keywords || []}
                isEditModeOn={isEditModeOn}
                selectedWorkSubmission={selectedWorkSubmission}
                workDeltaChanges={workDeltaChanges}
                setWorkDeltaChanges={setWorkDeltaChanges}
                isLoading={isLoading}
                className="w-full m-2"
            />
            {/* <div className="font-semibold pt-4">
                <div className="flex whitespace-nowrap">
                    Fields of Research:
                </div>
                {(metadata.fieldsOfResearch || []).map((field) => (
                    <div key={field} className="pl-2 pt-2 text-gray-700 font-normal">
                        {field}
                    </div>
                ))}
            </div> */}
        </div>
    );
};

export default WorkMetadataPanel;
