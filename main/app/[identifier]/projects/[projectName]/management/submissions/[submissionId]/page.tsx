"use client";

import React from "react";
import SubmissionCard from "@/components/cards/management/ProjectSubmissionCard";
import { useProjectSubmissionData } from "@/hooks/fetch/data-hooks/management/useProjectSubmissionData";
import useProjectData from "@/hooks/fetch/data-hooks/projects/useProjectDataTest";

export default function ProjectSubmissionPage({
    params: { submissionId },
}: {
    params: { submissionId: string };
}) {
    const projectSubmissionData = useProjectSubmissionData(Number(submissionId), true);
    const projectData = useProjectData(projectSubmissionData.data[0]?.projectId, !!projectSubmissionData.data[0]?.projectId);

    return (
        <div>
            <SubmissionCard submission={projectSubmissionData.data[0]} project={projectData.data[0]} isLoading={projectData.isLoading} />
        </div>
    );
}
