import { Citation, CodeBlock } from "@/types/workTypes";
import { keysToCamelCase } from "@/utils/functions";
import { useMemo } from "react";
import { HookResult, useGeneralData } from "../../useGeneralData";

const useCodeBlockData = (
    codeBlockId: string,
    enabled?: boolean
): HookResult<CodeBlock> => {
    const codeBlockData = useGeneralData<CodeBlock>({
        fetchGeneralDataParams: {
            tableName: "code_blocks",
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: [codeBlockId],
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
                    source_object_id: [codeBlockId],
                    source_object_type: "CodeBlock",
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    const codeBlock: CodeBlock = useMemo(() => {
        const firstCodeBlock = codeBlockData.data
            ? codeBlockData.data[0]
            : null;

        if (firstCodeBlock) {
            const transformedFirstCodeBlock = keysToCamelCase(firstCodeBlock);
            return {
                ...transformedFirstCodeBlock,
                citations: citationData,
            };
        }
        return null;
    }, [codeBlockData.data, citationData]);

    const result: HookResult<CodeBlock> = {
        data: [codeBlock],
        totalCount: codeBlockData.totalCount,
        isLoading: codeBlockData.isLoading,
        serviceError: codeBlockData.serviceError,
    };

    return result;
};

export default useCodeBlockData;
