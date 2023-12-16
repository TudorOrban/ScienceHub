"use client";

import { useWorkSubmissionData } from "@/hooks/fetch/data-hooks/management/useWorkSubmissionData";
import { useWorkDataByIdentifier } from "@/hooks/fetch/data-hooks/works/useWorkDataByIdentifier";
import WorkSubmissionCard from "@/components/cards/management/WorkSubmissionCard";

export const revalidate = 3600;

export default function SubmitPage({
    params: { identifier, submissionId },
}: {
    params: { identifier: string; submissionId: string };
}) {
    const workSubmissionData = useWorkSubmissionData(Number(submissionId), true, true);

    const workData = useWorkDataByIdentifier(
        {
            workId: workSubmissionData.data[0]?.workId.toString(),
            workType: workSubmissionData.data[0]?.workType,
        },
        !!workSubmissionData.data[0]
    );

    return (
        <div>
            <WorkSubmissionCard
                submission={workSubmissionData.data[0]}
                work={workData.data[0]}
                isLoading={workSubmissionData.isLoading}
                workIsLoading={workSubmissionData.isLoading}
                refetchSubmission={workSubmissionData.refetch}
                refetchWork={workData.refetch}
            />
        </div>
    );
}
