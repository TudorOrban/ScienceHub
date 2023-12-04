import { useGeneralData } from "../fetch/useGeneralData";
import { UserAllWorksSmall } from "@/types/workTypes";

export interface WorksSmallSearchOptions {
    tableRowsIds: string[];
    enabled?: boolean;
}

export const useAllUserWorksSmall = ({
    tableRowsIds,
    enabled,
}: WorksSmallSearchOptions) => {
    return useGeneralData<UserAllWorksSmall>({
        fetchGeneralDataParams: {
            tableName: "users",
            categories: [
                "experiments",
                "datasets",
                "data_analyses",
                "ai_models",
                "code_blocks",
                "papers",
            ],
            withCounts: true,
            options: {
                tableRowsIds: tableRowsIds,
                tableFields: ["id", "username", "full_name"],
                categoriesFetchMode: {
                    experiments: "fields",
                    datasets: "fields",
                    data_analyses: "fields",
                    ai_models: "fields",
                    code_blocks: "fields",
                    papers: "fields",
                },
                categoriesFields: {
                    experiments: ["id", "title"],
                    datasets: ["id", "title"],
                    data_analyses: ["id", "title"],
                    ai_models: ["id", "title"],
                    code_blocks: ["id", "title"],
                    papers: ["id", "title"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
};
