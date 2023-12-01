"use client";

import React from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { ProjectSubmission } from "@/types/versionControlTypes";
import SubmissionCard from "@/components/cards/management/SubmissionCard";
import { useProjectSubmissionData } from "@/app/hooks/fetch/data-hooks/management/useProjectSubmissionData";

export default function ProjectSubmissionPage({ params }: { params: { submissionId: string } }) {
    const projectSubmissionData = useProjectSubmissionData(params.submissionId, true);
    const emptySubmission: ProjectSubmission = { id: 0, title: "", projectId: 0 };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <SubmissionCard projectSubmission={projectSubmissionData.data[0] || emptySubmission} />
            </div>
        </div>
    );
}
