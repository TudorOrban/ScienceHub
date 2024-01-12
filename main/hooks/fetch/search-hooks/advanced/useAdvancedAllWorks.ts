import { useUserId } from "@/contexts/current-user/UserIdContext";
import { AIModel, CodeBlock, DataAnalysis, Dataset, Experiment, Paper } from "@/types/workTypes";
import { useObjectsWithUsers } from "../works/useObjectsWithUsers";
import { useAdvancedSearch } from "@/advanced-search/hooks/useAdvancedSearch";

type AllWorksAdvancedParams = {
    filters?: Record<string, any>;
    activeTab: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

export const useAdvancedAllWorks = ({
    filters,
    activeTab,
    context,
    page,
    itemsPerPage,
}: AllWorksAdvancedParams) => {
    // Hooks
    const experimentsData = useAdvancedSearch<Experiment>({
        fetchGeneralDataParams: {
            tableName: "experiments",
            categories: ["projects", "users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "updated_at", "title", "description", "public", "work_type", "link"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    teams: ["id", "team_username", "team_name"],
                    projects: ["id", "name", "users!project_users(id, full_name, username))"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Experiments",
        },
        extraFilters: filters,
        context: context || "Browse Works",
    })();
    console.log("QE", experimentsData);

    const datasetsData = useAdvancedSearch<Dataset>({
        fetchGeneralDataParams: {
            tableName: "datasets",
            categories: ["projects", "users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "updated_at", "title", "description", "public", "work_type", "link"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    teams: ["id", "team_username", "team_name"],
                    projects: ["id", "name", "users!project_users(id, full_name, username))"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Datasets",
        },
        extraFilters: filters,
        context: context || "Browse Works",
    })();

    const dataAnalysesData = useAdvancedSearch<DataAnalysis>({
        fetchGeneralDataParams: {
            tableName: "data_analyses",
            categories: ["projects", "users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "updated_at", "title", "description", "public", "work_type", "link"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    teams: ["id", "team_username", "team_name"],
                    projects: ["id", "name", "users!project_users(id, full_name, username))"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Data Analyses",
        },
        extraFilters: filters,
        context: context || "Browse Works",
    })();

    const aiModelsData = useAdvancedSearch<AIModel>({
        fetchGeneralDataParams: {
            tableName: "ai_models",
            categories: ["projects", "users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "updated_at", "title", "description", "public", "work_type", "link"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    teams: ["id", "team_username", "team_name"],
                    projects: ["id", "name", "users!project_users(id, full_name, username))"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "AI Models",
        },
        extraFilters: filters,
        context: context || "Browse Works",
    })();

    const codeBlocksData = useAdvancedSearch<CodeBlock>({
        fetchGeneralDataParams: {
            tableName: "code_blocks",
            categories: ["projects", "users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "updated_at", "title", "description", "public", "work_type", "link"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    teams: ["id", "team_username", "team_name"],
                    projects: ["id", "name", "users!project_users(id, full_name, username))"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Code Blocks",
        },
        extraFilters: filters,
        context: context || "Browse Works",
    })();

    const papersData = useAdvancedSearch<Paper>({
        fetchGeneralDataParams: {
            tableName: "papers",
            categories: ["projects", "users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "updated_at", "title", "description", "public", "work_type", "link"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "full_name", "username"],
                    projects: ["id", "name", "users!project_users(id, full_name, username))"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Papers",
        },
        extraFilters: filters,
        context: context || "Browse Works",
    })();

    // Merge with users
    const mergedExperiments = useObjectsWithUsers({
        objectsData: experimentsData,
        tableName: "experiment",
        enabled: activeTab === "Experiments",
    });
    const mergedDatasets = useObjectsWithUsers({
        objectsData: datasetsData,
        tableName: "dataset",
        enabled: activeTab === "Datasets",
    });
    const mergedDataAnalyses = useObjectsWithUsers({
        objectsData: dataAnalysesData,
        tableName: "data_analysis",
        enabled: activeTab === "Data Analysis",
    });
    const mergedAIModels = useObjectsWithUsers({
        objectsData: aiModelsData,
        tableName: "ai_model",
        enabled: activeTab === "AI Models",
    });
    const mergedCodeBlocks = useObjectsWithUsers({
        objectsData: codeBlocksData,
        tableName: "code_block",
        enabled: activeTab === "Code Blocks",
    });
    const mergedPapers = useObjectsWithUsers({
        objectsData: papersData,
        tableName: "paper",
        enabled: activeTab === "Papers",
    });


    return { mergedExperiments, mergedDatasets, mergedDataAnalyses, mergedAIModels, mergedCodeBlocks, mergedPapers,
        experimentsLoading: experimentsData.isLoading, datasetsLoading: datasetsData.isLoading, dataAnalysesLoading: dataAnalysesData.isLoading, aiModelsLoading: aiModelsData.isLoading, codeBlocksLoading: codeBlocksData.isLoading, papersLoading: papersData.isLoading,
    };
};
