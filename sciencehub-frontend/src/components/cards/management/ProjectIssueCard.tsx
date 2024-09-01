"use client";

import SmallProjectCard from "@/src/components/cards/small-cards/SmallProjectCard";
import UsersAndTeamsSmallUI from "@/src/components/elements/UsersAndTeamsSmallUI";
import VisibilityTag from "@/src/components/elements/VisibilityTag";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useProjectSmallContext } from "@/src/contexts/project/ProjectSmallContext";
import { useProjectIssueData } from "@/src/hooks/fetch/data-hooks/management/useProjectIssueData";
import { useProjectIssueResponses } from "@/src/hooks/fetch/data-hooks/management/useProjectIssueResponses";
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import { ProjectIssue, ProjectIssueResponse } from "@/src/types/managementTypes";
import { formatDate } from "@/src/utils/functions";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IssueResponsesCard from "./IssueResponsesCard";
import CreatedAtUpdatedAt from "@/src/components/elements/CreatedAtUpdatedAt";

interface ProjectIssueCardProps {
    issueId: number;
    initialIssueData?: FetchResult<ProjectIssue>;
    initialIssueResponsesData: FetchResult<ProjectIssueResponse>;
    isLoading?: boolean;
}

/**
 * Component for displaying a full project issue. Used in dynamic route.
 */
const ProjectIssueCard: React.FC<ProjectIssueCardProps> = ({
    issueId,
    initialIssueData,
    initialIssueResponsesData,
    isLoading,
}) => {
    // Contexts
    const { projectSmall } = useProjectSmallContext();

    // Custom hooks for hydrating initial server fetch
    const issueData = useProjectIssueData(issueId || 0, !!issueId, initialIssueData);
    const issue = issueData.data[0];

    const issueResponsesData = useProjectIssueResponses(
        issueId || 0,
        !!issueId,
        initialIssueResponsesData
    );
    const issueResponses = issueResponsesData.data;

    return (
        <div>
            {/* Header */}
            <div
                className="flex items-start justify-between flex-wrap md:flex-nowrap px-4 md:px-10 py-4 border border-gray-300 shadow-sm rounded-b-sm"
                style={{ backgroundColor: "var(--page-header-bg-color)" }}
            >
                {/* Left side: Title, Authors, Created At */}
                <div className="min-w-[320px] w-[320px] md:w-auto mr-4">
                    <div className="flex items-center">
                        <div
                            className="flex items-center font-semibold mb-4 mt-4 ml-6"
                            style={{ fontSize: "24px" }}
                        >
                            <FontAwesomeIcon
                                icon={faCircleInfo}
                                className="text-gray-700 pr-2"
                                style={{
                                    width: "17px",
                                }}
                            />
                            {!isLoading ? (
                                <>{issue?.title || ""}</>
                            ) : (
                                <Skeleton className="w-40 h-8 bg-gray-400 ml-2" />
                            )}
                        </div>

                        <VisibilityTag isPublic={issue?.public} />
                    </div>
                    <UsersAndTeamsSmallUI
                        label="Authors: "
                        users={issue?.users || []}
                        teams={issue?.teams || []}
                        isLoading={isLoading}
                    />
                    <CreatedAtUpdatedAt createdAt={issue?.createdAt} updatedAt={issue?.updatedAt} />
                </div>

                {/* Right-side: Actions Buttons */}
                <div className="flex flex-col items-end justify-end space-y-2 pt-2">
                    <div className="flex items-center">
                        <span className="font-semibold mr-2">{"Project:"}</span>
                        <SmallProjectCard projectSmall={projectSmall} />
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold mr-2">{"Status:"}</span>
                        <span>{issue?.status}</span>
                    </div>
                </div>
            </div>
            {issue?.description && (
                <div className="flex items-center flex-wrap p-4">
                    <span className="text-lg font-semibold">{"Description: "}</span>
                    <p className="ml-2">{issue?.description}</p>
                </div>
            )}

            {/* Issue Responses */}
            <IssueResponsesCard
                issueResponses={issueResponses}
                issueId={issue.id}
                issueType="Project Issue"
            />
        </div>
    );
};

export default ProjectIssueCard;
