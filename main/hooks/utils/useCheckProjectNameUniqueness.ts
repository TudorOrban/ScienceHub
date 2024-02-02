import { ProjectSmall } from "@/types/projectTypes";
import { useGeneralData } from "../fetch/useGeneralData";

/**
 * Util used in CreateProjectForm to verify chosen name is unique.
 * Will restrict to uniqueness among user's projects in the future.
 */
export const useCheckProjectNameUniqueness = (projectName: string, enabled?: boolean) => {
    const projectSmall = useGeneralData<ProjectSmall>({
        fetchGeneralDataParams: {
            tableName: "projects",
            categories: [],
            withCounts: true,
            options: {
                tableFields: ["id", "name", "title"],
                page: 1,
                itemsPerPage: 10,
                filters: {
                    name: projectName,
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    return !((projectSmall?.data.length || 0) > 0);
};
