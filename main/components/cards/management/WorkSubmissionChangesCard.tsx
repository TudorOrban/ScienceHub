import { workTypeIconMap } from "@/components/elements/SmallWorkCard";
import UsersAndTeamsSmallUI from "@/components/elements/UsersAndTeamsSmallUI";
import VisibilityTag from "@/components/elements/VisibilityTag";
import GeneralBox from "@/components/lists/GeneralBox";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getWorkVersionedFields,
    metadataVersionedFields,
} from "@/config/worksVersionedFields.config";
import { WorkDelta, WorkDeltaKey, WorkSubmission } from "@/types/versionControlTypes";
import { Work, WorkKey, WorkMetadata } from "@/types/workTypes";
import { applyTextDiffs } from "@/version-control-system/diff-logic/applyTextDiff";
import { faQuestion, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubmissionChangesBox from "./WorkSubmissionChangesBox";

interface WorkSubmissionChangesCardProps {
    submission: WorkSubmission;
    work: Work;
    isLoading?: boolean;
}

const WorkSubmissionChangesCard: React.FC<WorkSubmissionChangesCardProps> = ({
    submission,
    work,
    isLoading,
}) => {
    const fileChanges = submission?.fileChanges;
    const fileLocation = fileChanges?.fileToBeAdded || fileChanges?.fileToBeUpdated;

    const changesKeys = Object.keys(submission?.workDelta || {});
    const versionedFields = getWorkVersionedFields(work?.workType);
    const fieldChanges = (versionedFields as WorkKey[])?.filter((field) =>
        versionedFields?.includes(field as WorkKey)
    );

    const metadataChanges = metadataVersionedFields.filter((field) =>
        changesKeys.includes(field.key)
    ).map((field) => field.key);

    return (
        <div className="px-4 py-2 space-y-4">
            <div className="min-w-[320px] w-[320px] md:w-auto ml-8 mr-4 mb-4">
                <div className="flex items-center">
                    <div
                        className="flex items-center font-semibold mb-2 mt-2 ml-6"
                        style={{ fontSize: "20px" }}
                    >
                        <FontAwesomeIcon
                            icon={workTypeIconMap(work?.workType || "")?.icon || faQuestion}
                            className="text-gray-800 pr-2"
                            style={{
                                width: "15px",
                                color:
                                    workTypeIconMap(work?.workType || "")?.color || "rgb(31 41 55)",
                            }}
                        />
                        {!isLoading ? (
                            <>{work?.title || ""}</>
                        ) : (
                            <Skeleton className="w-40 h-8 bg-gray-400 ml-2" />
                        )}
                    </div>

                    <VisibilityTag isPublic={work?.public} />
                </div>

                <UsersAndTeamsSmallUI
                    label="Main Authors: "
                    users={work?.users || []}
                    teams={work?.teams || []}
                    isLoading={isLoading}
                />
            </div>
            <SubmissionChangesBox submission={submission} work={work} label={"Modified Fields"} fields={fieldChanges} isMetadata={false} />
            <SubmissionChangesBox submission={submission} work={work} label={"Modified Metadata Fields"} fields={metadataChanges} isMetadata={true} />
            {fileLocation && (
                <GeneralBox
                    title={`${work?.workType} to be added: `}
                    currentItems={[{ title: fileLocation?.filename }]}
                    noFooter={true}
                    contentOn={true}
                    itemClassName="px-4"
                />
            )}
        </div>
    );
};

export default WorkSubmissionChangesCard;
