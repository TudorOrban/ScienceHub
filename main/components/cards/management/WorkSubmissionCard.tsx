"use client";

import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import UsersAndTeamsSmallUI from "@/components/elements/UsersAndTeamsSmallUI";
import VisibilityTag from "@/components/elements/VisibilityTag";
import { Skeleton } from "@/components/ui/skeleton";
import { handleAcceptWorkSubmission } from "@/submit-handlers/handleAcceptWorkSubmission";
import { handleSubmitWorkSubmission } from "@/submit-handlers/handleSubmitWorkSubmission";
import { TextDiff, WorkDeltaKey, WorkSubmission } from "@/types/versionControlTypes";
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
