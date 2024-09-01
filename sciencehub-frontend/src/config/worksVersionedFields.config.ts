import { AIModel, CodeBlock, DataAnalysis, Dataset, Experiment, Paper } from "@/src/types/workTypes";

/**
 * Util configuring work fields to be versioned
 */
export const experimentVersionedFields: (keyof Experiment)[] = [
    "title",
    "description",
    "objective",
    "hypothesis",
    "methodology",
];
export const datasetVersionedFields: (keyof Dataset)[] = ["title", "description"];
export const dataAnalysisVersionedFields: (keyof DataAnalysis)[] = ["title", "description"];
export const aiModelVersionedFields: (keyof AIModel)[] = ["title", "description"];
export const codeBlockVersionedFields: (keyof CodeBlock)[] = ["title", "description"];
export const paperVersionedFields: (keyof Paper)[] = ["title", "description", "abstract"];

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
    }
    return undefined;
};

export const metadataVersionedFields = [
    {
        key: "doi",
        type: "TextDiff",
    },
    {
        key: "license",
        type: "TextDiff",
    },
    {
        key: "publisher",
        type: "TextDiff",
    },
    {
        key: "conference",
        type: "TextDiff",
    },
    {
        key: "researchGrants",
        type: "ArrayDiff",
    },
    {
        key: "tags",
        type: "ArrayDiff",
    },
    {
        key: "keywords",
        type: "ArrayDiff",
    },
];

/**
 * Util to obtain bucket names from workType
 */
export const getWorkBucketName = (workType: string) => {
    switch (workType) {
        case "Experiment":
            return "pdfs";
        case "Dataset":
            return "datasets";
        case "Data Analysis":
            return "notebooks";
        case "AI Model":
            return "models";
        case "Code Block":
            return "code_blocks";
        case "Paper":
            return "pdfs";
    }
};

export const arrayFields = ["researchGrants", "tags", "keywords"];
