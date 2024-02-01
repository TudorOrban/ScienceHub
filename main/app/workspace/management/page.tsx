"use client";

import CustomTable from "@/components/lists/CustomTable";
import { formatDate } from "@/utils/functions";
import Link from "next/link";
import VisibilityTag from "@/components/elements/VisibilityTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfoCircle, faPaste } from "@fortawesome/free-solid-svg-icons";
import { useAllUserProjectsSmall } from "@/hooks/utils/useAllUserProjectsSmall";
import { useProjectSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import { useProjectIssuesSearch } from "@/hooks/fetch/search-hooks/management/useProjectIssuesSearch";
import { useProjectReviewsSearch } from "@/hooks/fetch/search-hooks/management/useProjectReviewsSearch";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
import WorkspaceOverviewHeader from "@/components/headers/WorkspaceOverviewHeader";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";

export default function ManagementPage() {
    const itemsPerPage = 10;

    // Contexts
    const { userSmall } = useUserSmallDataContext();
    const currentUserId = userSmall.data?.[0]?.id;

    // Custom hooks
    // Fetch user projects and works for submission requests
    const projectsSmall = useAllUserProjectsSmall({
        tableRowsIds: [currentUserId || ""],
        enabled: !!currentUserId,
    });
    const projectsIds = projectsSmall.data[0]?.projects?.map((project) => project.id);

    // Fetch submissions, issues, and reviews
    const projectSubmissionsData = useProjectSubmissionsSearch({
        extraFilters: { users: currentUserId || "" },
        tableFilters: { project_id: projectsIds },
        enabled: !!currentUserId && !!projectsIds,
        context: "Workspace General",
        page: 1,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const projectIssuesData = useProjectIssuesSearch({
        extraFilters: { users: currentUserId || "" },
        tableFilters: { project_id: projectsIds },
        enabled: !!currentUserId && !!projectsIds,
        context: "Workspace General",
        page: 1,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const projectReviewsData = useProjectReviewsSearch({
        extraFilters: { users: currentUserId || "" },
        tableFilters: { project_id: projectsIds },
        enabled: !!currentUserId && !!projectsIds,
        context: "Workspace General",
        page: 1,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <>
            <WorkspaceOverviewHeader
                startingActiveTab="Management"
                currentUser={userSmall.data?.[0]}
            />
            <div className="p-4 space-y-4 overflow-x-hidden">
                {/* Submissions */}
                <div>
                    <div className={`flex items-center pb-4 pl-4 text-gray-900`}>
                        <FontAwesomeIcon icon={faPaste} className="mr-2 small-icon" />
                        <h3 className="text-xl font-semibold">Project Submissions</h3>
                    </div>
                    <CustomTable
                        columns={[
                            {
                                label: "Title",
                                accessor: (submission) => (
                                    <Link
                                        href={`/workspace/management/submissions/${submission.id}`}
                                        className="text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                    >
                                        {submission.title}
                                    </Link>
                                ),
                            },
                            {
                                label: "Last Modified",
                                accessor: (submission) => (
                                    <span>{formatDate(submission.updatedAt || "")}</span>
                                ),
                            },
                            {
                                label: "Status",
                                accessor: (submission) => <span>{submission.status}</span>,
                            },
                            {
                                label: "Initial Version ID",
                                accessor: (submission) => (
                                    <span>{submission.initialProjectVersionId}</span>
                                ),
                            },
                            {
                                label: "Final Version ID",
                                accessor: (submission) => (
                                    <span>{submission.finalProjectVersionId}</span>
                                ),
                            },
                            {
                                label: "Visibility",
                                accessor: (submission) => (
                                    <VisibilityTag isPublic={submission.public} />
                                ),
                            },
                        ]}
                        data={projectSubmissionsData.data || []}
                        footer={
                            <div className="flex justify-center py-2">
                                <Link
                                    href={`/workspace/management/submissions`}
                                    className="text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                >
                                    See All Submissions
                                </Link>
                            </div>
                        }
                        noDataMessage="No Project Submissions."
                    />
                </div>

                {/* Issues */}
                <div>
                    <div className="flex items-center pb-4 pl-4 text-gray-900">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 small-icon" />
                        <h3 className="text-xl font-semibold">Project Issues</h3>
                    </div>
                    <CustomTable
                        columns={[
                            {
                                label: "Title",
                                accessor: (issue) => (
                                    <Link
                                        href={`/workspace/management/issues/${issue.id}`}
                                        className="text-gray-900 hover:text-blue-700 hover:underline  font-semibold"
                                    >
                                        {issue.title}
                                    </Link>
                                ),
                            },
                            {
                                label: "Last Modified",
                                accessor: (issue) => (
                                    <span>{formatDate(issue.updatedAt || "")}</span>
                                ),
                            },
                            {
                                label: "Status",
                                accessor: (issue) => <span>{issue.status}</span>,
                            },
                            {
                                label: "Visibility",
                                accessor: (issue) => <VisibilityTag isPublic={issue.public} />,
                            },
                        ]}
                        data={projectIssuesData.data || []}
                        footer={
                            <div className="flex justify-center py-2">
                                <Link
                                    href={`/workspace/management/issues`}
                                    className="text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                >
                                    See All Issues
                                </Link>
                            </div>
                        }
                        noDataMessage="No Issues."
                    />
                </div>

                {/* Reviews */}
                <div>
                    <div className="flex items-center pb-4 pl-4 text-gray-900">
                        <FontAwesomeIcon icon={faEdit} className="mr-2 small-icon" />
                        <h3 className="text-xl font-semibold">Project Reviews</h3>
                    </div>
                    <CustomTable
                        columns={[
                            {
                                label: "Title",
                                accessor: (review) => (
                                    <Link
                                        href={`/workspace/management/reviews/${review.id}`}
                                        className="text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                    >
                                        {review.title}
                                    </Link>
                                ),
                            },
                            {
                                label: "Last Modified",
                                accessor: (review) => (
                                    <span>{formatDate(review.updatedAt || "")}</span>
                                ),
                            },
                            {
                                label: "Review Type",
                                accessor: (review) => <span>{review.reviewType}</span>,
                            },
                            {
                                label: "Status",
                                accessor: (review) => <span>{review.status}</span>,
                            },
                            {
                                label: "Visibility",
                                accessor: (review) => <VisibilityTag isPublic={review.public} />,
                            },
                        ]}
                        data={projectReviewsData.data || []}
                        footer={
                            <div className="flex justify-center py-2">
                                <Link
                                    href={`/workspace/management/reviews`}
                                    className="text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                >
                                    See All Reviews
                                </Link>
                            </div>
                        }
                        noDataMessage="No Reviews."
                    />
                </div>
            </div>
        </>
    );
}
