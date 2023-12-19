import { Citation, DataAnalysis } from "@/types/workTypes";
import { useMemo } from "react";
import { HookResult, useGeneralData } from "../../useGeneralData";

const useDataAnalysisData = (
    dataAnalysisId: string,
    enabled?: boolean
): HookResult<DataAnalysis> => {
    const dataAnalysisData = useGeneralData<DataAnalysis>({
        fetchGeneralDataParams: {
            tableName: "data_analyses",
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: [dataAnalysisId],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    const citationData = useGeneralData<Citation>({
        fetchGeneralDataParams: {
            tableName: "citations",
            categories: [],
            options: {
                filters: {
                    source_object_id: [dataAnalysisId],
                    source_object_type: "DataAnalysis",
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    
    const dataAnalysis: DataAnalysis[] = useMemo(() => {
        if (dataAnalysisData.data && citationData.data) {
            return [{
                ...dataAnalysisData.data[0],
                citations: citationData.data,
            }];
        } else return [];
    }, [dataAnalysisData.data, citationData.data]);

    const result: HookResult<DataAnalysis> = {
        data: dataAnalysis,
        totalCount: dataAnalysisData.totalCount,
        isLoading: dataAnalysisData.isLoading,
        serviceError: dataAnalysisData.serviceError,
    };

    return result;
};

export default useDataAnalysisData;
