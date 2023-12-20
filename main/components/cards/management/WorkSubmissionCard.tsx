"use client";
import { WorkSubmission } from "@/types/versionControlTypes";
import { Work, } from "@/types/workTypes";
import React, { useState } from "react";
import SubmissionChangesCard from "./SubmissionChangesCard";
import SubmissionHeader from "@/components/headers/SubmissionHeader";

interface WorkSubmissionCardProps {
    submission: WorkSubmission;
    work: Work;
    isLoading?: boolean;
    workIsLoading?: boolean;
    refetchSubmission?: () => void;
    refetchWork?: () => void;
    revalidatePath?: (pathname: string) => void;
    identifier?: string;
}

const WorkSubmissionCard: React.FC<WorkSubmissionCardProps> = ({
    submission,
    work,
    isLoading,
    workIsLoading,
    refetchSubmission,
    refetchWork,
    revalidatePath,
    identifier,
}) => {
    
    return (
        <div>
            <SubmissionHeader submission={submission} work={work} isLoading={isLoading} refetchSubmission={refetchSubmission} revalidatePath={revalidatePath} identifier={identifier} />
            <SubmissionChangesCard submission={submission} work={work} isLoading={isLoading} />
        </div>
    );
};

export default WorkSubmissionCard;
