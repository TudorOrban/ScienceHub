import { HookResult, useGeneralData } from "@/src/hooks/fetch/useGeneralData";
import { WorkSubmission } from "@/src/types/versionControlTypes";
import { CodeBlock, Experiment, Work, WorkIdentifier } from "@/src/types/workTypes";
// import { applyWorkDeltaDiffs } from "../diff-logic/applyWorkDeltaDiffs";
import { getObjectNames } from "@/src/config/getObjectNames";

interface FindWorkDataProps {
    openedWorkIdentifiers: WorkIdentifier[];
    workSubmissions: WorkSubmission[];
    workType: string;
    enabled?: boolean;
}

/**
 * Function for computing the final version of a specifed work using corresponding delta
 * To be used in UnifiedEditor if not moved to backend.
 */
export const findFinalVersionWorkData = ({
    openedWorkIdentifiers,
    workSubmissions,
    workType,
    enabled,
}: FindWorkDataProps) => {
    const workNames = getObjectNames({ label: workType });

    // Fetch user opened works
    const openedWorksData = useGeneralData<Work>({
        fetchGeneralDataParams: {
            tableName: workNames?.tableName || "",
            categories: [],
            options: {
                tableRowsIds:
                    openedWorkIdentifiers
                        .filter((work) => work.workType === workNames?.label)
                        .map((work) => work.workId?.toString() || "0") || [],
            },
        },
        reactQueryOptions: {
            enabled: enabled && !!workNames?.tableName,
        },
    });

    // Use opened works and fetched work submissions to find final project version work data
    const finalVersionWorkData = openedWorksData.data?.map((work) => {
        const correspWorkSubmission = workSubmissions?.find(
            (workSubmission) =>
                workSubmission.workType === workNames?.label && workSubmission.workId === work.id
        );
        if (correspWorkSubmission?.workDelta) {
            return work;
            // return applyWorkDeltaDiffs(work, correspWorkSubmission?.workDelta?.textDiffs);
            // TODO: fix this
        } else {
            return work;
        }
    });

    const result: HookResult<Work> = {
        data: finalVersionWorkData,
        isLoading: openedWorksData.isLoading,
        serviceError: openedWorksData.serviceError,
    };

    return result;
};
