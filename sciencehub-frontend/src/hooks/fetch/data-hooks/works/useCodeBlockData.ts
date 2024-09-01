import { Citation, CodeBlock } from "@/src/types/workTypes";
import { useMemo } from "react";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";

const useCodeBlockData = (
    codeBlockId: number,
    enabled?: boolean,
    initialData?: FetchResult<CodeBlock>
): HookResult<CodeBlock> => {
    const codeBlockData = useGeneralData<CodeBlock>({
        fetchGeneralDataParams: {
            tableName: "code_blocks",
            categories: ["users", "projects"],
            withCounts: true,
            options: {
                tableRowsIds: [codeBlockId],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                    projects: "fields"
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    projects: ["id", "title", "name"],
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
                    source_object_id: [codeBlockId],
                    source_object_type: "CodeBlock",
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    const codeBlock: CodeBlock[] = useMemo(() => {
        if (codeBlockData.data && citationData.data) {
            return [{
                ...codeBlockData.data[0],
                citations: citationData.data,
            }];
        } else return [];
    }, [codeBlockData.data, citationData.data]);

    const result: HookResult<CodeBlock> = {
        data: codeBlock,
        totalCount: codeBlockData.totalCount,
        isLoading: codeBlockData.isLoading,
        serviceError: codeBlockData.serviceError,
    };

    return result;
};

export default useCodeBlockData;
