import { ProjectDelta, ProjectSubmission } from "@/types/versionControlTypes";
import { ProjectMetadata } from "@/types/projectTypes";
import ProjectEditableTextField from "./ProjectEditableTextField";
import ProjectEditableTextArrayField from "./ProjectEditableTextArrayField";

interface ProjectPanelProps {
    metadata: ProjectMetadata;
    isEditModeOn: boolean;
    selectedProjectSubmission: ProjectSubmission;
    projectDeltaChanges: ProjectDelta;
    setProjectDeltaChanges: (projectDeltaChanges: ProjectDelta) => void;
    isLoading?: boolean;
}

/**
 * Panel for Project Metadata, using editable text fields and Edit Mode
 */
const ProjectMetadataPanel: React.FC<ProjectPanelProps> = ({
    metadata,
    isEditModeOn,
    selectedProjectSubmission,
    projectDeltaChanges,
    setProjectDeltaChanges,
    isLoading,
}) => {
    return (
        <div
            className="flex-shrink-0 p-4 border border-gray-300 shadow-md h-full"
            style={{ width: "250px" }}
        >
            <div className="font-semibold text-xl text-black">Metadata</div>
            <ProjectEditableTextField
                label="License"
                fieldKey="license"
                isEditModeOn={isEditModeOn}
                initialVersionContent={metadata?.license || ""}
                selectedProjectSubmission={selectedProjectSubmission}
                projectDeltaChanges={projectDeltaChanges}
                setProjectDeltaChanges={setProjectDeltaChanges}
                isLoading={isLoading}
                className="w-full m-2"
            />
            <ProjectEditableTextField
                label="Publisher"
                fieldKey="publisher"
                initialVersionContent={metadata?.publisher || ""}
                isEditModeOn={isEditModeOn}
                selectedProjectSubmission={selectedProjectSubmission}
                projectDeltaChanges={projectDeltaChanges}
                setProjectDeltaChanges={setProjectDeltaChanges}
                isLoading={isLoading}
                className="w-full m-2"
            />
            <ProjectEditableTextField
                label="Conference"
                fieldKey="conference"
                initialVersionContent={metadata?.conference || ""}
                isEditModeOn={isEditModeOn}
                selectedProjectSubmission={selectedProjectSubmission}
                projectDeltaChanges={projectDeltaChanges}
                setProjectDeltaChanges={setProjectDeltaChanges}
                isLoading={isLoading}
                className="w-full m-2"
            />
            <ProjectEditableTextArrayField
                label="Keywords"
                fieldKey="keywords"
                initialVersionContents={metadata?.keywords || []}
                isEditModeOn={isEditModeOn}
                selectedProjectSubmission={selectedProjectSubmission}
                projectDeltaChanges={projectDeltaChanges}
                setProjectDeltaChanges={setProjectDeltaChanges}
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

export default ProjectMetadataPanel;
