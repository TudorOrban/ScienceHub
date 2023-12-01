import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectSubmission } from "@/types/versionControlTypes";
import { useProjectSubmissionsSearch } from "@/app/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";

export type VersionInfo = {
    initialProjectVersionId: string;
    finalProjectVersionId: string;
    areVersionsDefined: boolean;
};

type SubmissionLogicOutput = {
    selectedSubmission: number | null;
    setSelectedSubmission: React.Dispatch<React.SetStateAction<number | null>>;
    submissionsData: ProjectSubmission[] | null;
    submissionsError: any;
    submissionsLoading?: boolean;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedSubmissionData: ProjectSubmission | null;
    versionInfo: VersionInfo | null;
};

export function useSubmissionLogic(
    userId: string | null,
    projectId: number | null,
    projectSubmissionId: number | null,
    setProjectSubmissionId: React.Dispatch<React.SetStateAction<number | null>>,
    enabled?: boolean
): SubmissionLogicOutput {
    const router = useRouter();

    // State for submissions
    const [selectedSubmission, setSelectedSubmission] = useState<number | null>(
        null
    );

    const isUserIdAvailable = userId !== null && userId !== undefined;
    const shouldEnable = (enabled !== undefined && enabled !== null) ? enabled : true;
    const actualEnabled = isUserIdAvailable && shouldEnable;

    // Fetching submissions
    const submissionsData = useProjectSubmissionsSearch({
        extraFilters: {},
        enabled: actualEnabled,
        context: "Project General",
    });

    // Handle submission selection
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;

        if (selectedValue === "create_new") {
            router.push(`/workspace/submissions`);
        } else {
            const selectedSubmissionId = parseInt(selectedValue, 10);
            setSelectedSubmission(selectedSubmissionId);
            setProjectSubmissionId(selectedSubmissionId);
        }
    };

    const selectedSubmissionData =
        ((submissionsData || {}).data || []).find(
            (submission) => submission.id === selectedSubmission
        ) || null;

    const versionInfo: VersionInfo | null = selectedSubmissionData
        ? {
              initialProjectVersionId:
                  selectedSubmissionData?.initialProjectVersionId?.toString() ||
                  "0",
              finalProjectVersionId:
                  selectedSubmissionData?.finalProjectVersionId?.toString() ||
                  "0",
              areVersionsDefined:
                  selectedSubmissionData?.initialProjectVersionId !== null &&
                  selectedSubmissionData?.finalProjectVersionId !== null,
          }
        : null;

    return {
        selectedSubmission,
        setSelectedSubmission,
        submissionsData: submissionsData.data,
        submissionsError: submissionsData.serviceError,
        submissionsLoading: submissionsData.isLoading,
        handleChange,
        selectedSubmissionData,
        versionInfo,
    };
}
