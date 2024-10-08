"use client";

import SmallWorkCard from "@/src/components/cards/small-cards/SmallWorkCard";
import UsersAndTeamsSmallUI from "@/src/components/elements/UsersAndTeamsSmallUI";
import VisibilityTag from "@/src/components/elements/VisibilityTag";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useWorkIssueData } from "@/src/hooks/fetch/data-hooks/management/useWorkIssueData";
import { useWorkIssueResponses } from "@/src/hooks/fetch/data-hooks/management/useWorkIssueResponses";
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import { WorkIssue, WorkIssueResponse } from "@/src/types/managementTypes";
import { formatDate } from "@/src/utils/functions";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IssueResponsesCard from "./IssueResponsesCard";
import CreatedAtUpdatedAt from "@/src/components/elements/CreatedAtUpdatedAt";

interface WorkIssueCardProps {
    issueId: number;
    initialIssueData?: FetchResult<WorkIssue>;
    initialIssueResponsesData: FetchResult<WorkIssueResponse>;
    isLoading?: boolean;
}

/**
 * Component for displaying a full work issue. Used in dynamic route.
 */
const WorkIssueCard: React.FC<WorkIssueCardProps> = ({
    issueId,
    initialIssueData,
    initialIssueResponsesData,
    isLoading,
}) => {
    // Custom hook for hydrating initial server fetch
    const issueData = useWorkIssueData(issueId || 0, !!issueId, initialIssueData);
    const issue = issueData.data[0];

    const issueResponsesData = useWorkIssueResponses(
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
                <div className="flex flex-col items-end justify-end space-y-2 pt-5">
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
                issueType="Work Issue"
            />
        </div>
    );
};

export default WorkIssueCard;
