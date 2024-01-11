import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useObjectsWithUsers } from "./useObjectsWithUsers";
import { useExperimentsSearch } from "./useExperimentsSearch";
import { useDatasetsSearch } from "./useDatasetsSearch";
import { useDataAnalysesSearch } from "./useDataAnalysesSearch";
import { useAIModelsSearch } from "./useAIModelsSearch";
import { useCodeBlocksSearch } from "./useCodeBlocksSearch";
import { usePapersSearch } from "./usePapersSearch";
import { AIModel, CodeBlock, DataAnalysis, Dataset, Experiment, Paper } from "@/types/workTypes";

export type AllWorksParams = {
    userId?: string | null | undefined;
    filters?: Record<string, any>;
    activeTab: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

export const useAllUserWorks = ({
    userId,
    filters,
    activeTab,
    context,
    page,
    itemsPerPage,
}: AllWorksParams) => {
    const experimentsData = useExperimentsSearch({
        extraFilters: { "users": userId },
        enabled: activeTab === "Experiments" && !!userId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const datasetsData = useDatasetsSearch({
        extraFilters: { users: userId },
        enabled: activeTab === "Datasets" && !!userId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const dataAnalysesData = useDataAnalysesSearch({
        extraFilters: { users: [userId] },
        enabled: activeTab === "Data Analyses" && !!userId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const aiModelsData = useAIModelsSearch({
        extraFilters: { users: userId },
        enabled: activeTab === "AI Models" && !!userId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const codeBlocksData = useCodeBlocksSearch({
        extraFilters: { users: userId },
        enabled: activeTab === "Code Blocks" && !!userId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const papersData = usePapersSearch({
        extraFilters: { users: userId },
        enabled: activeTab === "Papers" && !!userId,
        context: "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    // Merge with users
    const mergedExperiments = useObjectsWithUsers<Experiment>({
        objectsData: experimentsData,
        tableName: "experiment",
        enabled: activeTab === "Experiments" && !!experimentsData,
    });
    const mergedDatasets = useObjectsWithUsers<Dataset>({
        objectsData: datasetsData,
        tableName: "dataset",
        enabled: activeTab === "Datasets" && !!datasetsData,
    });
    const mergedDataAnalyses = useObjectsWithUsers<DataAnalysis>({
        objectsData: dataAnalysesData,
        tableName: "data_analysis",
        enabled: activeTab === "Data Analyses" && !!dataAnalysesData,
    });

    const mergedAIModels = useObjectsWithUsers<AIModel>({
        objectsData: aiModelsData,
        tableName: "ai_model",
        enabled: activeTab === "AI Models" && !!aiModelsData,
    });
    const mergedCodeBlocks = useObjectsWithUsers<CodeBlock>({
        objectsData: codeBlocksData,
        tableName: "code_block",
        enabled: activeTab === "Code Blocks" && !!codeBlocksData,
    });
    const mergedPapers = useObjectsWithUsers<Paper>({
        objectsData: papersData,
        tableName: "paper",
        enabled: activeTab === "Papers" && !!papersData,
    });

    return {
        mergedExperiments,
        mergedDatasets,
        mergedDataAnalyses,
        mergedAIModels,
        mergedCodeBlocks,
        mergedPapers,
    };
};
