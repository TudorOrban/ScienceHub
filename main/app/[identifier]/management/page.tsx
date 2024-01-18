"use client";

import CustomTable from "@/components/lists/CustomTable";
import { formatDate } from "@/utils/functions";
import Link from "next/link";
import VisibilityTag from "@/components/elements/VisibilityTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfoCircle, faPaste } from "@fortawesome/free-solid-svg-icons";
import { useAllUserProjectsSmall } from "@/hooks/utils/useAllUserProjectsSmall";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useProjectSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import { useProjectIssuesSearch } from "@/hooks/fetch/search-hooks/management/useProjectIssuesSearch";
import { useProjectReviewsSearch } from "@/hooks/fetch/search-hooks/management/useProjectReviewsSearch";
import { useIdentifierContext } from "@/contexts/current-user/IdentifierContext";
import UserProfileHeader from "@/components/headers/UserProfileHeader";

export default function ManagementPage({
    params: { identifier },
}: {
    params: { identifier: string };
}) {
    const itemsPerPage = 10;

    const { identifier: contextIdentifier, users, teams, isUser } = useIdentifierContext();
    const currentUserId = users?.[0]?.id;
    const fetchProjects = !!currentUserId && isUser;

    // Fetch user projects and works for submission requests
    const projectsSmall = useAllUserProjectsSmall({
        tableRowsIds: [currentUserId || ""],
        enabled: fetchProjects,
    });
    const projectsIds = projectsSmall.data[0]?.projects?.map((project) => project.id);
    const enabled = fetchProjects && !!projectsIds;

    // Fetch project and work submissions
    const projectSubmissionsData = useProjectSubmissionsSearch({
        extraFilters: { users: currentUserId || "" },
        tableFilters: { project_id: projectsIds },
        enabled: enabled,
        context: "Reusable",
        page: 1,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    // Fetch project and work issues
    const projectIssuesData = useProjectIssuesSearch({
        extraFilters: { users: currentUserId || "" },
        tableFilters: { project_id: projectsIds },
        enabled: enabled,
        context: "Reusable",
        page: 1,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    // Fetch project and work reviews
    const projectReviewsData = useProjectReviewsSearch({
        extraFilters: { users: currentUserId || "" },
        tableFilters: { project_id: projectsIds },
        enabled: enabled,
        context: "Reusable",
        page: 1,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    if (!enabled) {
        return (
            <div className="flex justify-center h-40 py-8 text-xl font-semibold">
                This page is not available.
            </div>
        );
    }

    return (
        <div>
            <UserProfileHeader startingActiveTab="Management" />
            <div className="p-4 space-y-4 overflow-x-hidden">
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
        </div>
    );
}
