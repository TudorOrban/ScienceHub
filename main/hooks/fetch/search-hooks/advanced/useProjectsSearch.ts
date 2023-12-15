import { useMemo } from "react";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { MediumProjectCard } from "@/types/projectTypes";
import { SmallSearchOptions } from "@/types/utilsTypes";
import { useTableUsers } from "@/hooks/utils/useTableUsers";
import { useTableTeams } from "@/hooks/utils/useTableTeams";
import { HookResult } from "../../useGeneralData";
import { useAdvancedSearch } from "@/advanced-search/hooks/useAdvancedSearch";

export const useAdvancedProjectsSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
}: SmallSearchOptions) => {
    const result = useAdvancedSearch<MediumProjectCard>({
        fetchGeneralDataParams: {
            tableName: "projects",
            categories: [
                "users",
                "teams",
                "experiments",
                "datasets",
                "data_analyses",
                "ai_models",
                "code_blocks",
                "papers",
            ],
            withCounts: true,
            options: {
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "all",
                    teams: "all",
                    experiments: "count",
                    datasets: "count",
                    data_analyses: "count",
                    ai_models: "count",
                    code_blocks: "count",
                    papers: "count",
                },
                categoriesFields: {
                    users: ["id"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
        extraFilters: extraFilters,
        context: context || "Workspace General",
    })();

    const projects = result.data || [];
    const projectIds = projects.map((project) => project.id.toString()) || [];
    const {
        data: projectUsers,
        error: projectError,
        isLoading: projectUsersLoading,
    } = useTableUsers({
        objectIds: projectIds,
        tableName: "project",
    });
    const {
        data: projectTeams,
        error: projectTeamsError,
        isLoading: projectTeamsLoading,
    } = useTableTeams({
        objectIds: projectIds,
        tableName: "project",
    });

    // Merge project with users and teams
    const combinedProjects = useMemo(() => {
        if (!projects || !projectUsers || !projectTeams) return [];

        return projects.map((project) => {
            const matchingUsersData = projectUsers.find(
                (projectUser) => projectUser.objectId === project.id.toString()
            );
            const matchingTeamsData = projectTeams.find(
                (projectTeam) => projectTeam.objectId === project.id.toString()
            );

            const allUsers = matchingUsersData ? matchingUsersData.users : [];
            const allTeams = matchingTeamsData ? matchingTeamsData.teams : [];

            return {
                ...project,
                users: allUsers,
                teams: allTeams,
            };
        });
    }, [projects, projectUsers, projectTeams]);

    const trasformedData: MediumProjectCard[] = combinedProjects.map((project) => {
        return {
            experimentsCount: (project as any).experiments[0].count,
            datasetsCount: (project as any).datasets[0].count,
            dataAnalysisCount: (project as any).dataAnalyses[0].count,
            aiModelsCount: (project as any).aiModels[0].count,
            codeBlocksCount: (project as any).codeBlocks[0].count,
            papersCount: (project as any).papers[0].count,
            ...project
        }
    })

    const finalResult: HookResult<MediumProjectCard> = {
        data: trasformedData,
        totalCount: result.totalCount,
        isLoading: result.isLoading,
        serviceError: result.serviceError,
        hookError: result.hookError,
    }

    return finalResult;
};
