import { UserAllWorksSmall, WorkSmall } from "@/types/workTypes";
import { HookResult } from "../hooks/fetch/useGeneralData";

/**
 * Util for flattening works attached to a user
 */
export const flattenWorks = (worksData: HookResult<UserAllWorksSmall>): WorkSmall[] => {
    const experiments = (worksData.data[0]?.experiments || []).map((experiment) => {
        const work: WorkSmall = {
            id: experiment.id,
            title: experiment.title,
            workType: "Experiment",
        };

        return work;
    });
    const datasets = (worksData.data[0]?.datasets || []).map((dataset) => {
        const work: WorkSmall = {
            id: dataset.id,
            title: dataset.title,
            workType: "Dataset",
        };

        return work;
    });
    const dataAnalyses = (worksData.data[0]?.dataAnalyses || []).map((dataAnalysis) => {
        const work: WorkSmall = {
            id: dataAnalysis.id,
            title: dataAnalysis.title,
            workType: "Data Analysis",
        };

        return work;
    });
    const aiModels = (worksData.data[0]?.aiModels || []).map((aiModel) => {
        const work: WorkSmall = {
            id: aiModel.id,
            title: aiModel.title,
            workType: "AI Model",
        };

        return work;
    });
    const codeBlocks = (worksData.data[0]?.codeBlocks || []).map((codeBlock) => {
        const work: WorkSmall = {
            id: codeBlock.id,
            title: codeBlock.title,
            workType: "Code Block",
        };

        return work;
    });
    const papers = (worksData.data[0]?.papers || []).map((paper) => {
        const work: WorkSmall = {
            id: paper.id,
            title: paper.title,
            workType: "Paper",
        };

        return work;
    });

    const works: WorkSmall[] = [
        ...(experiments as WorkSmall[]),
        ...(datasets as WorkSmall[]),
        ...(dataAnalyses as WorkSmall[]),
        ...(aiModels as WorkSmall[]),
        ...(codeBlocks as WorkSmall[]),
        ...(papers as WorkSmall[]),
    ];

    return works;
};
