import UsersAndTeamsSmallUI from "@/components/elements/UsersAndTeamsSmallUI";
import VisibilityTag from "@/components/elements/VisibilityTag";
import GeneralBox from "@/components/lists/GeneralBox";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getProjectVersionedFields,
    metadataVersionedFields,
} from "@/config/projectVersionedFields.config";
import { ProjectDelta, ProjectDeltaKey, ProjectSubmission } from "@/types/versionControlTypes";
import { ProjectLayout, ProjectLayoutKey, ProjectMetadata } from "@/types/projectTypes";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";
import { faBoxArchive, faQuestion, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProjectSubmissionChangesBox from "./ProjectSubmissionChangesBox";

interface ProjectSubmissionChangesCardProps {
    submission: ProjectSubmission;
    project: ProjectLayout;
    isLoading?: boolean;
}

const ProjectSubmissionChangesCard: React.FC<ProjectSubmissionChangesCardProps> = ({
    submission,
    project,
    isLoading,
}) => {
    const changesKeys = Object.keys(submission?.projectDelta || {});
    const versionedFields = getProjectVersionedFields();
    const fieldChanges = versionedFields?.filter((field) =>
        versionedFields.includes(field as ProjectLayoutKey)
    );

    const metadataChanges = metadataVersionedFields.filter((field) =>
        changesKeys.includes(field.key)
    ).map((field) => field.key);

    console.log("DSADSADAS", submission);
    return (
        <div className="px-4 py-2 space-y-4">
            <div className="min-w-[320px] w-[320px] md:w-auto ml-8 mr-4 mb-4">
                <div className="flex items-center">
                    <div
                        className="flex items-center font-semibold mb-2 mt-2 ml-6"
                        style={{ fontSize: "20px" }}
                    >
                        <FontAwesomeIcon
                            icon={faBoxArchive}
                            className="text-gray-800 pr-2"
                            style={{
                                width: "15px",
                                color: "rgb(31 41 55)",
                            }}
                        />
                        {!isLoading ? (
                            <>{project?.title || ""}</>
                        ) : (
                            <Skeleton className="w-40 h-8 bg-gray-400 ml-2" />
                        )}
                    </div>

                    <VisibilityTag isPublic={project?.public} />
                </div>

                <UsersAndTeamsSmallUI
                    label="Main Authors: "
                    users={project?.users || []}
                    teams={project?.teams || []}
                    isLoading={isLoading}
                />
            </div>
            <ProjectSubmissionChangesBox submission={submission} project={project} label={"Modified Fields"} fields={fieldChanges} isMetadata={false} />
            <ProjectSubmissionChangesBox submission={submission} project={project} label={"Modified Metadata Fields"} fields={metadataChanges} isMetadata={true} />
            {/* {fileLocation && (
                <GeneralBox
                    title={`${project?.projectType} to be added: `}
                    currentItems={[{ title: fileLocation?.filename }]}
                    noFooter={true}
                    contentOn={true}
                    itemClassName="px-4"
                />
            )} */}
        </div>
    );
};

export default ProjectSubmissionChangesCard;
