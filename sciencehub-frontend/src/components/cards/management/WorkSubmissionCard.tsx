"use client";

import { WorkSubmission } from "@/src/types/versionControlTypes";
import { Work } from "@/src/types/workTypes";
import React from "react";
import WorkSubmissionHeader from "@/src/components/headers/WorkSubmissionHeader";
import WorkSubmissionChangesCard from "./WorkSubmissionChangesCard";

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

/**
 * Component for displaying a full work submission. Used in dynamic route.
 */
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
            <WorkSubmissionHeader
                submission={submission}
                work={work}
                isLoading={isLoading}
                refetchSubmission={refetchSubmission}
                revalidatePath={revalidatePath}
                identifier={identifier}
            />
            <WorkSubmissionChangesCard submission={submission} work={work} isLoading={isLoading} />
        </div>
    );
};

export default WorkSubmissionCard;
