import { HookResult, useGeneralData } from "@/hooks/fetch/useGeneralData";
import { WorkSubmission } from "@/types/versionControlTypes";
import { CodeBlock, Experiment, Work, WorkIdentifier } from "@/types/workTypes";
import { applyWorkDelta } from "./applyWorkDelta";
import { getObjectNames } from "@/utils/getObjectNames";

interface FindWorkDataProps {
    openedWorkIdentifiers: WorkIdentifier[];
    workSubmissions: WorkSubmission[];
    workType: string;
    enabled?: boolean;
}

export const findFinalVersionWorkData = ({
    openedWorkIdentifiers,
    workSubmissions,
    workType,
    enabled,
}: FindWorkDataProps) => {
    const workNames = getObjectNames({ label: workType });
    // Flatten works for fetching

    // Fetch user opened works
    const openedWorksData = useGeneralData<Work>({
        fetchGeneralDataParams: {
            tableName: workNames?.tableName || "",
            categories: [],
            options: {
                tableRowsIds:
                    openedWorkIdentifiers.filter((work) => work.workType === workNames?.label)
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
                workSubmission.workType === workNames?.label &&
                workSubmission.workId === work.id
        );
        if (correspWorkSubmission?.workDelta) {
            return applyWorkDelta(work, correspWorkSubmission?.workDelta);
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
