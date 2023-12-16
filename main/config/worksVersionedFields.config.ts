import { AIModel, CodeBlock, DataAnalysis, Dataset, Experiment, Paper } from "@/types/workTypes";

export const experimentVersionedFields: (keyof Experiment)[] = ["title", "description"];
export const datasetVersionedFields: (keyof Dataset)[] = ["title", "description"];
export const dataAnalysisVersionedFields: (keyof DataAnalysis)[] = ["title", "description"];
export const aiModelVersionedFields: (keyof AIModel)[] = ["title", "description"];
export const codeBlockVersionedFields: (keyof CodeBlock)[] = ["title", "description"];
export const paperVersionedFields: (keyof Paper)[] = ["title", "description"];

export const getWorkVersionedFields = (workType: string) => {
    switch (workType) {
        case "Experiment":
            return experimentVersionedFields;
        case "Dataset":
            return datasetVersionedFields;
        case "Data Analysis":
            return dataAnalysisVersionedFields;
        case "AI Model":
            return aiModelVersionedFields;
        case "Code Block":
            return codeBlockVersionedFields;
        case "Paper":
            return paperVersionedFields;
    };
    return undefined;
}