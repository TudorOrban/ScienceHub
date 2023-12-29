import React from "react";
import WorkIssueCard from "@/components/cards/management/WorkIssueCard";
import { WorkIssue, WorkIssueResponse } from "@/types/managementTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export default async function WorkIssuePage({
    params: { issueId },
}: {
    params: { issueId: string };
}) {
    const workIssueData = await fetchGeneralData<WorkIssue>(supabase, {
        tableName: "work_issues",
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

    const workIssueResponsesData = await fetchGeneralData<WorkIssueResponse>(supabase, {
        tableName: "work_issue_responses",
        categories: [],
        options: {
            tableFields: [
                "id",
                "created_at",
                "content",
                "work_issue_id",
                "users(id, username, full_name, avatar_url)",
            ],
            filters: {
                work_issue_id: Number(issueId),
            },
            page: 1,
            itemsPerPage: 10,
        },
    });

    // const isAuthorized = datasetData.data[0].public || ()

    if (!workIssueData.isLoading && workIssueData.data.length === 0) {
        notFound();
    }

    return (
        <WorkIssueCard
            issueId={Number(issueId)}
            initialIssueData={workIssueData}
            initialIssueResponsesData={workIssueResponsesData}
        />
    );
}
