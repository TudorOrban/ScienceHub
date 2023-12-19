import { WorkSubmission } from "@/types/versionControlTypes";
import { WorkMetadata } from "@/types/workTypes";
import EditableTextField from "./EditableTextField";
import EditableTextArrayField from "./EditableTextArrayField";

interface WorkPanelProps {
    metadata: WorkMetadata;
    isEditModeOn: boolean;
    selectedWorkSubmission: WorkSubmission;
    isLoading?: boolean;
}

// Panel
const WorkMetadataPanel: React.FC<WorkPanelProps> = ({
    metadata,
    isEditModeOn,
    selectedWorkSubmission,
    isLoading,
}) => {
    return (
        <div className="w-[280px] p-4 border border-gray-300 shadow-md h-full ml-4 lg:ml-0">
            <div className="font-semibold text-xl text-black">Metadata</div>
            <EditableTextField
                label="License"
                fieldKey="license"
                initialVersionContent={metadata?.license || ""}
                isEditModeOn={isEditModeOn}
                selectedWorkSubmission={selectedWorkSubmission}
                isMetadataField={true}
                isLoading={isLoading}
                className="w-full m-2"
            />
            <EditableTextField
                label="Publisher"
                fieldKey="publisher"
                initialVersionContent={metadata?.publisher || ""}
                isEditModeOn={isEditModeOn}
                selectedWorkSubmission={selectedWorkSubmission}
                isMetadataField={true}
                isLoading={isLoading}
                className="w-full m-2"
            />
            <EditableTextField
                label="Conference"
                fieldKey="conference"
                initialVersionContent={metadata?.conference || ""}
                isEditModeOn={isEditModeOn}
                selectedWorkSubmission={selectedWorkSubmission}
                isMetadataField={true}
                isLoading={isLoading}
                className="w-full m-2"
            />
            <EditableTextArrayField
                label="Keywords"
                fieldKey="keywords"
                initialVersionContents={metadata?.keywords || []}
                isEditModeOn={isEditModeOn}
                selectedWorkSubmission={selectedWorkSubmission}
                isMetadataField={true}
                isLoading={isLoading}
                className="w-full m-2"
            />
            {/* <PanelField fieldItems={[metadata.doi || ""]} label="DOI" flex={true} />
            <PanelField
                fieldItems={[metadata.license || "No license"]}
                label="License"
                flex={true}
            />
            <PanelField fieldItems={[metadata.publisher || ""]} label="Publisher" flex={true} />
            <PanelField fieldItems={[metadata.conference || ""]} label="Conference" flex={false} />
            <PanelField fieldItems={metadata.researchGrants} label="Research Grants" flex={false} /> */}

            {/* <div className="font-semibold pt-4">
                <div className="flex whitespace-nowrap">Keywords:</div>
                <div className="flex items-center pl-2 ">
                    {(metadata.keywords || []).map((keyword) => (
                        <div key={keyword} className="pr-1 pt-2 text-gray-700 font-normal text-sm">
                            {keyword + ","}
                        </div>
                    ))}
                </div>
            </div> */}
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
