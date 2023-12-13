import { Citation, Dataset } from "@/types/workTypes";
import { keysToCamelCase } from "@/utils/functions";
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
    
    const dataset: Dataset = useMemo(() => {
        const firstDataset = datasetData.data
            ? datasetData.data[0]
            : null;

        if (firstDataset) {
            const transformedFirstDataset = keysToCamelCase(firstDataset);
            return {
                ...transformedFirstDataset,
                citations: citationData,
            };
        }
        return null;
    }, [datasetData.data, citationData]);

    const result: HookResult<Dataset> = {
        data: [dataset],
        totalCount: datasetData.totalCount,
        isLoading: datasetData.isLoading,
        serviceError: datasetData.serviceError,
        refetch: datasetData.refetch,
    };

    return result;
};

export default useDatasetData;
