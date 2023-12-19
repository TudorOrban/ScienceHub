import { Citation, Dataset } from "@/types/workTypes";
import { useMemo } from "react";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { FetchResult } from "@/services/fetch/fetchGeneralData";

const useDatasetData = (
    datasetId: number,
    enabled?: boolean,
    initialData?: FetchResult<Dataset>,
): HookResult<Dataset> => {
    const datasetData = useGeneralData<Dataset>({
        fetchGeneralDataParams: {
            tableName: "datasets",
            categories: ["users", "projects"],
            withCounts: true,
            options: {
                tableRowsIds: [datasetId],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    projects: ["id", "title", "name"]
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
            initialData: initialData,
        },
    });

    const citationData = useGeneralData<Citation>({
        fetchGeneralDataParams: {
            tableName: "citations",
            categories: [],
            options: {
                filters: {
                    source_object_id: [datasetId],
                    source_object_type: "Dataset",
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    
    const dataset: Dataset[] = useMemo(() => {
        if (datasetData.data && citationData.data) {
            return [{
                ...datasetData.data[0],
                citations: citationData.data,
            }];
        } else return [];
    }, [datasetData.data, citationData.data]);

    const result: HookResult<Dataset> = {
        data: dataset,
        totalCount: datasetData.totalCount,
        isLoading: datasetData.isLoading,
        serviceError: datasetData.serviceError,
    };

    return result;
};

export default useDatasetData;
