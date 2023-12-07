import { Work, WorkIdentifier } from "@/types/workTypes";
import { findFinalVersionWorkData } from "./findFinalVersionWorkData";
import { WorkSubmission } from "@/types/versionControlTypes";

interface FinalVersionWorkDataProps {
    userOpenedWorks?: Record<number, WorkIdentifier>;
    workSubmissions?: WorkSubmission[];
    enabled?: boolean;
}

export const findAllFinalVersionWorksData = ({
    userOpenedWorks,
    workSubmissions,
    enabled,
}: FinalVersionWorkDataProps) => {
    const finalVersionExperiments = findFinalVersionWorkData({
        userOpenedWorks: userOpenedWorks || {},
        workSubmissions: workSubmissions || [],
        workType: "Experiment",
        enabled: enabled,
    });

    const finalVersionDatasets = findFinalVersionWorkData({
        userOpenedWorks: userOpenedWorks || {},
        workSubmissions: workSubmissions || [],
        workType: "Dataset",
        enabled: enabled,
    });

    const finalVersionDataAnalyses = findFinalVersionWorkData({
        userOpenedWorks: userOpenedWorks || {},
        workSubmissions: workSubmissions || [],
        workType: "Data Analysis",
        enabled: enabled,
    });

    const finalVersionAIModels = findFinalVersionWorkData({
        userOpenedWorks: userOpenedWorks || {},
        workSubmissions: workSubmissions || [],
        workType: "AI Model",
        enabled: enabled,
    });

    const finalVersionCodeBlocks = findFinalVersionWorkData({
        userOpenedWorks: userOpenedWorks || {},
        workSubmissions: workSubmissions || [],
        workType: "Code Block",
        enabled: enabled,
    });

    const finalVersionPapers = findFinalVersionWorkData({
        userOpenedWorks: userOpenedWorks || {},
        workSubmissions: workSubmissions || [],
        workType: "Paper",
        enabled: enabled,
    });

    return gatherAndOrderWorks(userOpenedWorks || {}, {
        "Experiment": finalVersionExperiments,
        "Dataset": finalVersionDatasets,
        "Data Analysis": finalVersionDataAnalyses,
        "AI Model": finalVersionAIModels,
        "Code Block": finalVersionCodeBlocks,
        "Paper": finalVersionPapers
    });
}

function gatherAndOrderWorks(
    userOpenedWorks: Record<number, WorkIdentifier>,
    workArrays: Record<string, Work[]>
): Work[] {
    // Flatten all work arrays into a single array
    const allWorks = Object.values(workArrays).flat();

    // Map work identifiers to actual work objects
    const workMap = new Map<number, Work>();
    allWorks.forEach(work => {
        workMap.set(work.id, work);
    });

    // Use the order in userOpenedWorks to build the final array
    return Object.values(userOpenedWorks).map(identifier => {
        return workMap.get(Number(identifier.workId));
    }).filter(work => work !== undefined) as Work[];
}