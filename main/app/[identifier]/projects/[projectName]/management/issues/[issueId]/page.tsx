"use client";

import React from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { useIssueData } from "@/app/hooks/fetch/data-hooks/management/useIssueData";
import { Issue } from "@/types/managementTypes";
import IssueCard from "@/components/cards/management/IssueCard";

export default function IssuePage({ params }: { params: { issueId: string } }) {
    const issueData = useIssueData(params.issueId, true);
    const emptyIssue: Issue = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <IssueCard issue={issueData.data[0] || emptyIssue} />
            </div>
        </div>
    );
}
