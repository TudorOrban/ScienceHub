import React from "react";
import ProjectIssueCard from "@/src/components/cards/management/ProjectIssueCard";
import { ProjectIssue, ProjectIssueResponse } from "@/src/types/managementTypes";
import { fetchGeneralData } from "@/src/services/fetch/fetchGeneralData";
import supabase from "@/src/utils/supabase";
import { notFound } from "next/navigation";

export default async function ProjectIssuePage({
    params: { issueId },
}: {
    params: { issueId: string };
}) {
    // Fetch project issue metadata and responses
    const projectIssueData = await fetchGeneralData<ProjectIssue>(supabase, {
        tableName: "project_issues",
        categories: ["users"],
        options: {
            tableRowsIds: [Number(issueId)],
            page: 1,
            itemsPerPage: 10,
            categoriesFetchMode: {
                users: "fields",
            },
            categoriesFields: {
                users: ["id", "username", "full_name"],
            },
        },
    });

    const projectIssueResponsesData = await fetchGeneralData<ProjectIssueResponse>(supabase, {
        tableName: "project_issue_responses",
        categories: [],
        options: {
            tableFields: [
                "id",
                "created_at",
                "content",
                "project_issue_id",
                "users(id, username, full_name, avatar_url)",
            ],
            filters: {
                project_issue_id: Number(issueId),
            },
            page: 1,
            itemsPerPage: 10,
        },
    });

    if (!projectIssueData.isLoading && projectIssueData.data.length === 0) {
        notFound();
    }

    return (
        <ProjectIssueCard
            issueId={Number(issueId)}
            initialIssueData={projectIssueData}
            initialIssueResponsesData={projectIssueResponsesData}
        />
    );
}
