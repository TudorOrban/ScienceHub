import { Work, WorkIdentifier } from "@/types/workTypes";
import { findFinalVersionWorkData } from "./findFinalVersionWorkData";
import { WorkSubmission } from "@/types/versionControlTypes";
import { HookResult } from "@/hooks/fetch/useGeneralData";

interface FinalVersionWorkDataProps {
    openedWorkIdentifiers?: WorkIdentifier[];
    workSubmissions?: WorkSubmission[];
    enabled?: boolean;
}

/**
 * Function to fetch and compute final version data for specified works and work submissions
 * To be used in UnifiedEditor if not moved to backend.
 */
export const findAllFinalVersionWorksData = ({
    openedWorkIdentifiers,
    workSubmissions,
    enabled,
}: FinalVersionWorkDataProps) => {
    const finalVersionExperiments = findFinalVersionWorkData({
        openedWorkIdentifiers: openedWorkIdentifiers || [],
        workSubmissions: workSubmissions || [],
        workType: "Experiment",
        enabled: enabled,
    });

    const finalVersionDatasets = findFinalVersionWorkData({
        openedWorkIdentifiers: openedWorkIdentifiers || [],
        workSubmissions: workSubmissions || [],
        workType: "Dataset",
        enabled: enabled,
    });

    const finalVersionDataAnalyses = findFinalVersionWorkData({
        openedWorkIdentifiers: openedWorkIdentifiers || [],
        workSubmissions: workSubmissions || [],
        workType: "Data Analysis",
        enabled: enabled,
    });

    const finalVersionAIModels = findFinalVersionWorkData({
        openedWorkIdentifiers: openedWorkIdentifiers || [],
        workSubmissions: workSubmissions || [],
        workType: "AI Model",
        enabled: enabled,
    });

    const finalVersionCodeBlocks = findFinalVersionWorkData({
        openedWorkIdentifiers: openedWorkIdentifiers || [],
        workSubmissions: workSubmissions || [],
        workType: "Code Block",
        enabled: enabled,
    });

    const finalVersionPapers = findFinalVersionWorkData({
        openedWorkIdentifiers: openedWorkIdentifiers || [],
        workSubmissions: workSubmissions || [],
        workType: "Paper",
        enabled: enabled,
    });

    const result: HookResult<Work> = {
        data: [
            ...finalVersionExperiments.data,
            ...finalVersionDatasets.data,
            ...finalVersionDataAnalyses.data,
            ...finalVersionAIModels.data,
            ...finalVersionCodeBlocks.data,
            ...finalVersionPapers.data,
        ],
        isLoading:
            finalVersionExperiments.isLoading ||
            finalVersionDatasets.isLoading ||
            finalVersionDataAnalyses.isLoading ||
            finalVersionAIModels.isLoading ||
            finalVersionCodeBlocks.isLoading ||
            finalVersionPapers.isLoading,
        serviceError: [
            finalVersionExperiments.serviceError,
            finalVersionDatasets.serviceError,
            finalVersionDataAnalyses.serviceError,
            finalVersionAIModels.serviceError,
            finalVersionCodeBlocks.serviceError,
            finalVersionPapers.serviceError,
        ],
    };
    return result;
};

interface ReconstructWorkDataProps {
    openedWorkIdentifiers: Record<number, Record<number, WorkIdentifier>>;
    finalVersionWorks: Work[];
}

export const reconstructWorkData = ({
    openedWorkIdentifiers,
    finalVersionWorks,
}: ReconstructWorkDataProps): Record<number, Record<number, Work>> => {
    const reconstructedData: Record<number, Record<number, Work>> = {};

    // Iterate through each window
    for (const [windowIdStr, worksInWindow] of Object.entries(openedWorkIdentifiers)) {
        const windowId = parseInt(windowIdStr);
        reconstructedData[windowId] = {};

        // Iterate through each work in the window
        for (const [workKeyStr, workIdentifier] of Object.entries(worksInWindow)) {
            const workId = parseInt(workKeyStr);
            // Find the corresponding fetched work
            const fetchedWork = finalVersionWorks?.find(
                (work) =>
                    work.id.toString() === workIdentifier.workId &&
                    work.workType === workIdentifier.workType
            );

            if (fetchedWork) {
                reconstructedData[windowId][workId] = fetchedWork;
            }
        }
    }

    return reconstructedData;
};
