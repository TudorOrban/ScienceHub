"use client";

import React from "react";
import ProjectSubmissionCard from "@/components/cards/management/ProjectSubmissionCard";
import { useProjectSubmissionData } from "@/hooks/fetch/data-hooks/management/useProjectSubmissionData";
import useProjectVersionedData from "@/hooks/fetch/data-hooks/projects/useProjectVersionedData";

export default function ProjectSubmissionPage({
    params: { submissionId },
}: {
    params: { submissionId: string };
}) {
    // Fetch submission data along with small project data
    const projectSubmissionData = useProjectSubmissionData(Number(submissionId), true, true); // TODO: dont fetch work deltas clientside in the future
    const projectData = useProjectVersionedData(
        projectSubmissionData.data[0]?.projectId,
        !!projectSubmissionData.data[0]?.projectId
    );

    return (
        <ProjectSubmissionCard
            submission={projectSubmissionData.data[0]}
            project={projectData.data[0]}
            isLoading={projectData.isLoading}
        />
    );
}
