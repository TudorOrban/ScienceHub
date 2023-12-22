
import React from "react";
import useCodeBlockData from "@/hooks/fetch/data-hooks/works/useCodeBlockData";
import CodeBlockCard from "@/components/cards/works/CodeBlockCard";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { CodeBlock } from "@/types/workTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export default async function CodeBlockPage({
    params: {codeBlockId},
}: {
    params: { codeBlockId: string };
}) {
    const codeBlockData = await fetchGeneralData<CodeBlock>(supabase, {
        tableName: "code_blocks",
        categories: ["users", "projects"],
        options: {
            tableRowsIds: [codeBlockId],
            page: 1,
            itemsPerPage: 10,
            categoriesFetchMode: {
                users: "fields",
                projects: "fields",
            },
            categoriesFields: {
                users: ["id", "username", "full_name"],
                projects: ["id", "name", "title"],
            },
        },
    });

    // const isAuthorized = datasetData.data[0].public || ()

    if (!codeBlockData.isLoading && codeBlockData.data.length === 0) {
        notFound();
    }

    return <CodeBlockCard codeBlockId={Number(codeBlockId)} initialData={codeBlockData} />;
}
