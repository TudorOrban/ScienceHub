"use client";

import { useProjectDataContext } from "@/contexts/project/ProjectDataContext";
import useProjectGraph from "@/version-control-system/hooks/useProjectGraph";
import CustomTable from "@/components/lists/CustomTable";
import { formatDate } from "@/utils/functions";
import Link from "next/link";
import VisibilityTag from "@/components/elements/VisibilityTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfoCircle, faPaste } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import dynamic from "next/dynamic";
const ProjectVersionGraph = dynamic(
    () => import("@/components/visualizations/ProjectVersionGraph")
);

export default function ManagementPage({
    params: { identifier, projectName },
}: {
    params: { identifier: string; projectName: string };
}) {
    const { projectLayout, setProjectLayout, isLoading, setIsLoading } = useProjectDataContext();
    const [projectGraphOn, setProjectGraphOn] = useState<boolean>(false);

    const projectGraphData = useProjectGraph(projectLayout.id || 0, !!projectLayout.id);

    return (
        <div className="p-4 space-y-4 overflow-x-hidden">
            <div>
                <div className={`flex items-center pb-4 pl-4 text-gray-900`}>
                    <FontAwesomeIcon icon={faPaste} className="mr-2 small-icon" />
                    <h3 className="text-xl font-semibold">Project Submissions</h3>
                    <button
                        onClick={() => setProjectGraphOn(!projectGraphOn)}
                        className="mt-0.5 ml-4 bg-white text-blue-600 hover:text-blue-700"
                    >
                        View Project Graph
                    </button>
                </div>
                {projectGraphOn && (
                    <ProjectVersionGraph
                        projectGraph={
                            projectGraphData.data[0] || {
                                id: 0,
                                projectId: "",
                                graphData: {},
                            }
                        }
                        selectedVersionId={""}
                        handleSelectGraphNode={() => {}}
                        expanded={true}
                        className="max-h-40 p-4 mb-8"
                    />
                )}
                <CustomTable
                    columns={[
                        {
                            label: "Title",
                            accessor: (submission) => (
                                <Link
                                    href={`/${identifier}/projects/${projectName}/management/submissions/${submission.id}`}
                                    className="text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                >
                                    {submission.title}
                                </Link>
                            ),
                        },
                        {
                            label: "Created At",
                            accessor: (submission) => (
                                <span>{formatDate(submission.createdAt || "")}</span>
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
                    data={projectLayout.projectSubmissions || []}
                    footer={
                        <div className="flex justify-center py-2">
                            <Link href={`/${identifier}/projects/${projectName}/management/submissions`} className="text-gray-900 hover:text-blue-700 hover:underline font-semibold">See All Submissions</Link>
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
                                    href={`/${identifier}/projects/${projectName}/management/issues/${issue.id}`}
                                    className="text-gray-900 hover:text-blue-700 hover:underline  font-semibold"
                                >
                                    {issue.title}
                                </Link>
                            ),
                        },
                        {
                            label: "Created At",
                            accessor: (issue) => <span>{formatDate(issue.createdAt || "")}</span>,
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
                    data={projectLayout.projectIssues || []}
                    footer={
                        <div className="flex justify-center py-2">
                            <Link href={`/${identifier}/projects/${projectName}/management/issues`} className="text-gray-900 hover:text-blue-700 hover:underline font-semibold">See All Issues</Link>
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
                                    href={`/${identifier}/projects/${projectName}/management/reviews/${review.id}`}
                                    className="text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                >
                                    {review.title}
                                </Link>
                            ),
                        },
                        {
                            label: "Created At",
                            accessor: (review) => <span>{formatDate(review.createdAt || "")}</span>,
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
                    data={projectLayout.projectReviews || []}
                    footer={
                        <div className="flex justify-center py-2">
                            <Link href={`/${identifier}/projects/${projectName}/management/reviews`} className="text-gray-900 hover:text-blue-700 hover:underline font-semibold">See All Reviews</Link>
                        </div>
                    }
                    noDataMessage="No Reviews."
                />
            </div>
        </div>
    );
}
