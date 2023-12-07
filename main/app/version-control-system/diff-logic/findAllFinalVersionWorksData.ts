import { Work, WorkIdentifier } from "@/types/workTypes";
import { findFinalVersionWorkData } from "./findFinalVersionWorkData";
import { WorkSubmission } from "@/types/versionControlTypes";

interface FinalVersionWorkDataProps {
    userOpenedWorkIdentifiers?: Record<number, Record<number, WorkIdentifier>>;
    workSubmissions?: WorkSubmission[];
    enabled?: boolean;
}

export const findAllFinalVersionWorksData = ({
    userOpenedWorkIdentifiers,
    workSubmissions,
    enabled,
}: FinalVersionWorkDataProps) => {
    const finalVersionExperiments = findFinalVersionWorkData({
        userOpenedWorkIdentifiers: userOpenedWorkIdentifiers || {},
        workSubmissions: workSubmissions || [],
        workType: "Experiment",
        enabled: enabled,
    });

    const finalVersionDatasets = findFinalVersionWorkData({
        userOpenedWorkIdentifiers: userOpenedWorkIdentifiers || {},
        workSubmissions: workSubmissions || [],
        workType: "Dataset",
        enabled: enabled,
    });

    const finalVersionDataAnalyses = findFinalVersionWorkData({
        userOpenedWorkIdentifiers: userOpenedWorkIdentifiers || {},
        workSubmissions: workSubmissions || [],
        workType: "Data Analysis",
        enabled: enabled,
    });

    const finalVersionAIModels = findFinalVersionWorkData({
        userOpenedWorkIdentifiers: userOpenedWorkIdentifiers || {},
        workSubmissions: workSubmissions || [],
        workType: "AI Model",
        enabled: enabled,
    });

    const finalVersionCodeBlocks = findFinalVersionWorkData({
        userOpenedWorkIdentifiers: userOpenedWorkIdentifiers || {},
        workSubmissions: workSubmissions || [],
        workType: "Code Block",
        enabled: enabled,
    });

    const finalVersionPapers = findFinalVersionWorkData({
        userOpenedWorkIdentifiers: userOpenedWorkIdentifiers || {},
        workSubmissions: workSubmissions || [],
        workType: "Paper",
        enabled: enabled,
    });


    const finalVersionWorks = {
        "Experiment": finalVersionExperiments,
        "Dataset": finalVersionDatasets,
        "Data Analysis": finalVersionDataAnalyses,
        "AI Model": finalVersionAIModels,
        "Code Block": finalVersionCodeBlocks,
        "Paper": finalVersionPapers,
    };

    return reconstructWorkData({
        userOpenedWorkIdentifiers: userOpenedWorkIdentifiers || {},
        finalVersionWorks: finalVersionWorks,
    });
};

interface ReconstructWorkDataProps {
    userOpenedWorkIdentifiers: Record<number, Record<number, WorkIdentifier>>;
    finalVersionWorks: Record<string, Work[]>; // Record of work type to array of works
}

const reconstructWorkData = ({
    userOpenedWorkIdentifiers,
    finalVersionWorks,
}: ReconstructWorkDataProps): Record<number, Record<number, Work>> => {
    const reconstructedData: Record<number, Record<number, Work>> = {};

    // Iterate through each window
    for (const [windowIdStr, worksInWindow] of Object.entries(userOpenedWorkIdentifiers)) {
        const windowId = parseInt(windowIdStr);
        reconstructedData[windowId] = {};

        // Iterate through each work in the window
        for (const [workIdStr, workIdentifier] of Object.entries(worksInWindow)) {
            const workId = parseInt(workIdStr);
            // Find the corresponding fetched work
            const fetchedWork = finalVersionWorks[workIdentifier.workType]?.find(
                work => work.id.toString() === workIdentifier.workId
            );

            if (fetchedWork) {
                reconstructedData[windowId][workId] = fetchedWork;
            }
        }
    }
    
    return reconstructedData;
};
