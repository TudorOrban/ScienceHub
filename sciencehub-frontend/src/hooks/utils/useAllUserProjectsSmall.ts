import { UserAllProjectsSmall } from "@/src/types/projectTypes";
import { useGeneralData } from "../fetch/useGeneralData";

export interface ProjectsSmallSearchOptions {
    tableRowsIds: string[];
    enabled?: boolean;
}

export const useAllUserProjectsSmall = ({
    tableRowsIds,
    enabled,
}: ProjectsSmallSearchOptions) => {
    return useGeneralData<UserAllProjectsSmall>({
        fetchGeneralDataParams: {
            tableName: "users",
            categories: [
                "projects",
            ],
            withCounts: true,
            options: {
                tableRowsIds: tableRowsIds,
                tableFields: ["id", "username", "full_name"],
                categoriesFetchMode: {
                    projects: "fields",
                },
                categoriesFields: {
                    projects: ["id", "title", "name"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
};
