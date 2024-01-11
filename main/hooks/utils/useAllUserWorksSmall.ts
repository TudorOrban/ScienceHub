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
                    experiments: ["id", "title", "updated_at", "work_type"],
                    datasets: ["id", "title", "updated_at", "work_type"],
                    data_analyses: ["id", "title", "updated_at", "work_type"],
                    ai_models: ["id", "title", "updated_at", "work_type"],
                    code_blocks: ["id", "title", "updated_at", "work_type"],
                    papers: ["id", "title", "updated_at", "work_type"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
};
