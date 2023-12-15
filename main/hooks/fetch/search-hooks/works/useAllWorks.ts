import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useObjectsWithUsers } from "./useObjectsWithUsers";
import { useExperimentsSearch } from "./useExperimentsSearch";
import { useDatasetsSearch } from "./useDatasetsSearch";
import { useDataAnalysesSearch } from "./useDataAnalysesSearch";
import { useAIModelsSearch } from "./useAIModelsSearch";
import { useCodeBlocksSearch } from "./useCodeBlocksSearch";
import { usePapersSearch } from "./usePapersSearch";
import { Experiment, WorkSmall } from "@/types/workTypes";
import { useAllUserProjectsSmall } from "@/hooks/utils/useAllUserProjectsSmall";
import { ProjectSmall } from "@/types/projectTypes";

export type AllWorksParams = {
    filters?: Record<string, any>;
    activeTab: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

export const useAllUserWorks = ({
    filters,
    activeTab,
    context,
    page,
    itemsPerPage,
}: AllWorksParams) => {
    // Hooks
    // Works
    const currentUserId = useUserId();
    const effectiveUserId =
        currentUserId || "794f5523-2fa2-4e22-9f2f-8234ac15829a";

    // Fetch user projects and works for received
    const projectsSmall = useAllUserProjectsSmall({
        tableRowsIds: [effectiveUserId],
        enabled: !!currentUserId,
    });
    const projects = projectsSmall.data[0]?.projects;
    const projectsIds = projects?.map((project) => project.id);

    const experimentsData = useExperimentsSearch({
        extraFilters: { users: currentUserId },
        enabled: activeTab === "Experiments" && !!currentUserId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const datasetsData = useDatasetsSearch({
        extraFilters: { users: currentUserId },
        enabled: activeTab === "Datasets" && !!currentUserId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const dataAnalysesData = useDataAnalysesSearch({
        extraFilters: { users: [currentUserId] },
        enabled: activeTab === "Data Analyses" && !!currentUserId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const aiModelsData = useAIModelsSearch({
        extraFilters: { users: currentUserId },
        enabled: activeTab === "AI Models" && !!currentUserId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const codeBlocksData = useCodeBlocksSearch({
        extraFilters: { users: currentUserId },
        enabled: activeTab === "Code Blocks" && !!currentUserId,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const papersData = usePapersSearch({
        extraFilters: { users: currentUserId },
        enabled: activeTab === "Papers" && !!currentUserId,
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
    const mergedDatasets = useObjectsWithUsers({
        objectsData: datasetsData,
        tableName: "dataset",
        enabled: activeTab === "Datasets" && !!datasetsData,
    });
    const mergedDataAnalyses = useObjectsWithUsers({
        objectsData: dataAnalysesData,
        tableName: "data_analysis",
        enabled: activeTab === "Data Analyses" && !!dataAnalysesData,
    });

    const mergedAIModels = useObjectsWithUsers({
        objectsData: aiModelsData,
        tableName: "ai_model",
        enabled: activeTab === "AI Models" && !!aiModelsData,
    });
    const mergedCodeBlocks = useObjectsWithUsers({
        objectsData: codeBlocksData,
        tableName: "code_block",
        enabled: activeTab === "Code Blocks" && !!codeBlocksData,
    });
    const mergedPapers = useObjectsWithUsers({
        objectsData: papersData,
        tableName: "paper",
        enabled: activeTab === "Papers" && !!papersData,
    });

    // Keep fetched projects and works for display
    let worksProjects: ProjectSmall[] = [];
    if (projects) {
        const allWorks: WorkSmall[] = [
            ...(mergedExperiments?.data as WorkSmall[]),
            ...(mergedDatasets?.data as WorkSmall[]),
            ...(mergedDataAnalyses?.data as WorkSmall[]),
            ...(mergedAIModels?.data as WorkSmall[]),
            ...(mergedCodeBlocks?.data as WorkSmall[]),
            ...(mergedPapers?.data as WorkSmall[]),
        ];
        const worksProjectsIds =
            allWorks?.map((work) => work.projectId?.toString() || "") || [];
        worksProjects =
            projects.filter((project) => projectsIds.includes(project.id)) ||
            [];
    }

    return {
        mergedExperiments,
        mergedDatasets,
        mergedDataAnalyses,
        mergedAIModels,
        mergedCodeBlocks,
        mergedPapers,
        worksProjects,
    };
};
