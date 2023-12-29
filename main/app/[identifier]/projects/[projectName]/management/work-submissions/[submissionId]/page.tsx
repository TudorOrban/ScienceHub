"use client";

import React from "react";
import SubmissionCard from "@/components/cards/management/ProjectSubmissionCard";
import { useProjectSubmissionData } from "@/hooks/fetch/data-hooks/management/useProjectSubmissionData";
import useProjectVersionedData from "@/hooks/fetch/data-hooks/projects/useProjectVersionedData";

export default function ProjectSubmissionPage({
    params: { submissionId },
}: {
    params: { submissionId: string };
}) {
    const projectSubmissionData = useProjectSubmissionData(Number(submissionId), true, true); // TODO: dont fetch work deltas clientside in the future
    const projectData = useProjectVersionedData(projectSubmissionData.data[0]?.projectId, !!projectSubmissionData.data[0]?.projectId);

    return (
        <div>
            <SubmissionCard submission={projectSubmissionData.data[0]} project={projectData.data[0]} isLoading={projectData.isLoading} />
        </div>
    );
}
