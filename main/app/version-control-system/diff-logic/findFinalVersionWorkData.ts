import { useGeneralData } from "@/app/hooks/fetch/useGeneralData";
import { WorkSubmission } from "@/types/versionControlTypes";
import { CodeBlock, Experiment, Work, WorkIdentifier } from "@/types/workTypes";
import { applyWorkDelta } from "./applyWorkDelta";
import { getObjectNames } from "@/utils/getObjectNames";

interface FindWorkDataProps {
    userOpenedWorkIdentifiers: Record<number, Record<number, WorkIdentifier>>;
    workSubmissions: WorkSubmission[];
    workType: string;
    enabled?: boolean;
}

export const findFinalVersionWorkData = ({
    userOpenedWorkIdentifiers,
    workSubmissions,
    workType,
    enabled,
}: FindWorkDataProps) => {

    const workNames = getObjectNames({ label: workType });
    const flatWorkIdentifiers = Object.values(userOpenedWorkIdentifiers).flatMap(windowWorks =>
        Object.values(windowWorks)
    );
    // console.log("DASKDASDA", );
    // // Fetch user opened works
    const openedCodeBlocksData = useGeneralData<Work>({
        fetchGeneralDataParams: {
            tableName: workNames?.tableName || "",
            categories: [],
            options: {
                tableRowsIds:
                    flatWorkIdentifiers.filter((work) => work.workType === workNames?.label)
                        .map((work) => work.workId?.toString() || "0") || [],
            },
        },
        reactQueryOptions: {
            enabled: enabled && !!workNames?.tableName,
        },
    });

    if (!enabled) return [];
    
    // Use opened works and fetched work submissions to find final project version work data
    return openedCodeBlocksData.data?.map((codeBlock) => {
        const correspWorkSubmission = workSubmissions?.find(
            (workSubmission) =>
                workSubmission.workType === workNames?.label &&
                workSubmission.workId === codeBlock.id
        );
        if (correspWorkSubmission?.workDelta) {
            return applyWorkDelta(codeBlock, correspWorkSubmission?.workDelta);
        } else {
            return codeBlock;
        }
    });
};
