import { useMemo } from "react";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { MediumProjectCard } from "@/types/projectTypes";
import { SmallSearchOptions } from "@/types/utilsTypes";
import { useTableUsers } from "@/app/hooks/utils/useTableUsers";
import { useTableTeams } from "@/app/hooks/utils/useTableTeams";
import { HookResult } from "../../useGeneralData";

export const useProjectsSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<MediumProjectCard>({
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
    });

    const result = useUnifiedSearch();

    const projects = result.data || [];
    const projectIds = projects.map((project) => project.id.toString()) || [];
    const {
        data: projectUsers,
        error: projectError,
        isLoading: projectUsersLoading,
    } = useTableUsers({
        objectIds: projectIds,
        tableName: "project",
        roles: ["Main Author"]
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

    // const trasformedData = result.data.map((project) => {
    //     return {
    //         experiments_count: project.experiments,
    //     }
    // })

    // const finalResult = {

    // }
    return finalResult;
};

// function transformToSmallProjectCard(rawData: any): SmallProjectCard {
//     if (rawData) {
//             const {
//                 created_at,
//                 research_score,
//                 h_index,
//                 total_project_citations_count,
//                 total_citations_count,
//                 experiments_count,
//                 datasets_count,
//                 data_analyses_count,
//                 ai_models_count,
//                 code_blocks_count,
//                 papers_count,
//                 // project_submissions_count,
//                 ...restOfRawData
//             } = rawData as any;

//             const firstTransformationData = {
//                 ...restOfRawData,
//                 createdAt: created_at,
//                 researchScore: research_score,
//                 hIndex: h_index,
//                 totalProjectCitationsCount: total_project_citations_count,
//                 totalCitationsCount: total_citations_count,
//                 experimentsCount: experiments_count,
//                 datasetsCount: datasets_count,
//                 dataAnalysesCount: data_analyses_count,
//                 aiModelsCount: ai_models_count,
//                 codeBlocksCount: code_blocks_count,
//                 papersCount: papers_count,
//                 // projectSubmissionsCount: project_submissions_count,
//             };

//             let transformedUsers: User[] = [];
//             let transformedTeams: Team[] = [];

//             if (firstTransformationData.teams) {
//                 transformedTeams = firstTransformationData.teams.map(
//                     (team: any) => {
//                         const transformedTeam: Team = {
//                             id: team.id,
//                             teamUsername: team.team_username,
//                             teamName: team.team_name,
//                         };
//                         return transformedTeam;
//                     }
//                 );
//             }

//             const transformedData: SmallProjectCard = {
//                 id: firstTransformationData.id,
//                 createdAt: firstTransformationData.createdAt,
//                 researchScore: firstTransformationData.researchScore,
//                 hIndex: firstTransformationData.hIndex,
//                 totalProjectCitationsCount:
//                     firstTransformationData.totalProjectCitationsCount,
//                 totalCitationsCount: firstTransformationData.totalCitationsCount,
//                 name: firstTransformationData.name,
//                 title: firstTransformationData.title,
//                 description: firstTransformationData.description,
//                 public: firstTransformationData.public,
//                 users: transformedUsers,
//                 teams: transformedTeams,
//                 experimentsCount: firstTransformationData.experimentsCount,
//                 datasetsCount: firstTransformationData.datasetsCount,
//                 dataAnalysesCount: firstTransformationData.dataAnalysesCount,
//                 aiModelsCount: firstTransformationData.aiModelsCount,
//                 codeBlocksCount: firstTransformationData.codeBlocksCount,
//                 papersCount: firstTransformationData.papersCount,
//                 // projectSubmissionsCount: firstTransformationData.projectSubmissionsCount,
//             };
//             return transformedData;
//     } else {
//         const empty: SmallProjectCard = { id: 0 };
//         return empty;
//     }
// }

// export const useTransformedUserSmallProjectCardsSearch = (userId: string) => {
//     const queryResult = useUserSmallProjectCardsSearch(userId);

//     const transformedData = queryResult.data
//         ? queryResult.data.map(transformToSmallProjectCard)
//         : [];

//     return { ...queryResult, data: transformedData };
// };








    // const [tableRowsIds, setTableRowsIds] = useState<string[]>([]);
    // const { data: userProjects, isLoading: userLoading, isError: userError } = useUserProjects(userId);

    // useEffect(() => {
    //     if (userProjects && !userLoading && !userError) {
    //         const projectIds = userProjects.map((project) =>
    //             project.projectId.toString()
    //         );
    //         setTableRowsIds(projectIds);
    //     }
    // }, [userProjects, userLoading, userError]);