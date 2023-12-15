"use client";

import React from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import ProjectSubmissionCard from "@/components/cards/management/ProjectSubmissionCard";
import { ProjectSubmission } from "@/types/versionControlTypes";
import PageSelect from "@/components/complex-elements/PageSelect";
import { useProjectSubmissionData } from "@/app/hooks/fetch/data-hooks/management/useProjectSubmissionData";

export default function SubmissionsPage({
    params,
}: {
    params: { submissionId: string };
}) {
    const projectSubmissionData = useProjectSubmissionData(params.submissionId);
    const emptyProjectSubmission: ProjectSubmission = { id: 0, projectId: 0, createdAt: "" };
    // const { aiModelData, error } = useAIModelData(params.aiModelId);
    // const emptyAIModel: AIModel = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                {/* <AIModelCard aiModel={aiModelData || emptyAIModel}/> */}
                <ProjectSubmissionCard projectSubmission={projectSubmissionData.data[0] || emptyProjectSubmission}/>
                <PageSelect itemsPerPage={10} numberOfElements={20} />
            </div>
        </div>
    );
}
