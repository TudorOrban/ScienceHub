"use client";

import SmallProjectCard from "@/components/elements/SmallProjectCard";
import UsersAndTeamsSmallUI from "@/components/elements/UsersAndTeamsSmallUI";
import VisibilityTag from "@/components/elements/VisibilityTag";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectSmallContext } from "@/contexts/project/ProjectSmallContext";
import { useProjectIssueData } from "@/hooks/fetch/data-hooks/management/useProjectIssueData";
import { useProjectIssueResponses } from "@/hooks/fetch/data-hooks/management/useProjectIssueResponses";
import { FetchResult } from "@/services/fetch/fetchGeneralData";
import { ProjectIssue, ProjectIssueResponse } from "@/types/managementTypes";
import { formatDate } from "@/utils/functions";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IssueResponsesCard from "./IssueResponsesCard";

interface ProjectIssueCardProps {
    issueId: number;
    initialIssueData?: FetchResult<ProjectIssue>;
    initialIssueResponsesData: FetchResult<ProjectIssueResponse>;
    isLoading?: boolean;
}

const ProjectIssueCard: React.FC<ProjectIssueCardProps> = ({
    issueId,
    initialIssueData,
    initialIssueResponsesData,
    isLoading,
}) => {
    const { projectSmall } = useProjectSmallContext();


    // Custom hook for hydrating initial server fetch
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

                    <div className="flex whitespace-nowrap py-4 pl-1 text-gray-800 font-semibold">
                        {issue?.createdAt && (
                            <div className="flex items-center mr-2">
                                Created at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(issue?.createdAt || "")}
                                </div>
                            </div>
                        )}
                        {issue?.updatedAt && (
                            <div className="flex items-center">
                                Updated at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(issue?.updatedAt || "")}
                                </div>
                            </div>
                        )}
                    </div>
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
            <IssueResponsesCard issueResponses={issueResponses} issueId={issue.id} issueType="Project Issue"/>
        </div>
    );
};

export default ProjectIssueCard;
