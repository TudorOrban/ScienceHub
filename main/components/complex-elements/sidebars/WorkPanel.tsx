import { WorkSubmission } from "@/types/versionControlTypes";
import { WorkMetadata } from "@/types/workTypes";
import { useWorkEditableTextField } from "@/version-control-system/hooks/useWorkEditableTextField";

interface PanelFieldProps {
    fieldItems?: string[];
    label: string;
    flex?: boolean;
}

const PanelField: React.FC<PanelFieldProps> = ({ fieldItems, label, flex }) => {
    return (
        <div className={`${flex ? "flex items-center" : ""} font-semibold pt-4`}>
            <div className="flex whitespace-nowrap">{label + ": "}</div>
            {fieldItems &&
                fieldItems.length > 0 &&
                fieldItems[0] !== "" &&
                fieldItems.map((item, index) => (
                    <div key={index} className="pl-2 text-gray-700 font-normal text-sm">
                        {item}
                    </div>
                ))}
        </div>
    );
};


interface WorkPanelProps {
    metadata: WorkMetadata;
    initialVersionContent: string;
    isEditModeOn: boolean;
    selectedWorkSubmission: WorkSubmission;
}

// Panel
const WorkPanel: React.FC<WorkPanelProps> = ({ metadata }) => {
    return (
        <div className="w-[22rem] p-4 border border-gray-300 shadow-md h-full ml-4 lg:ml-0">
            <div className="font-semibold text-xl text-black">Metadata</div>
            {/* <PanelField fieldItems={[metadata.doi || ""]} label="DOI" flex={true} /> */}
            <PanelField
                fieldItems={[metadata.license || "No license"]}
                label="License"
                flex={true}
            />
            <PanelField fieldItems={[metadata.publisher || ""]} label="Publisher" flex={true} />
            <PanelField fieldItems={[metadata.conference || ""]} label="Conference" flex={false} />
            <PanelField fieldItems={metadata.researchGrants} label="Research Grants" flex={false} />

            <div className="font-semibold pt-4">
                <div className="flex whitespace-nowrap">Keywords:</div>
                <div className="flex items-center pl-2 ">
                    {(metadata.keywords || []).map((keyword) => (
                        <div key={keyword} className="pr-1 pt-2 text-gray-700 font-normal text-sm">
                            {keyword + ","}
                        </div>
                    ))}
                </div>
            </div>
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

export default WorkPanel;
