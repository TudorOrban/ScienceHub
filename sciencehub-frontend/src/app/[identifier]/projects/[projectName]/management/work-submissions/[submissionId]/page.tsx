"use client";

import React from "react";
import WorkSubmissionCard from "@/src/components/cards/management/WorkSubmissionCard";
import { useWorkSubmissionData } from "@/src/hooks/fetch/data-hooks/management/useWorkSubmissionData";
import { Work } from "@/src/types/workTypes";

export default function ProjectSubmissionPage({
    params: { submissionId },
}: {
    params: { submissionId: string };
}) {
    // Fetch submission data along with associated work
    // TODO: fetch actual work
    const workSubmissionData = useWorkSubmissionData(Number(submissionId), true, true);
    const workData: Work = { id: 0, title: "", workType: "Experiment" };

    return (
        <div>
            <WorkSubmissionCard submission={workSubmissionData.data[0]} work={workData} isLoading={workSubmissionData.isLoading} />
        </div>
    );
}
