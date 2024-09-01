
import React from "react";
import CodeBlockCard from "@/src/components/cards/works/CodeBlockCard";
import { CodeBlock } from "@/src/types/workTypes";
import { fetchGeneralData } from "@/src/services/fetch/fetchGeneralData";
import supabase from "@/src/utils/supabase";
import { notFound } from "next/navigation";

export default async function CodeBlockPage({
    params: {codeBlockId},
}: {
    params: { codeBlockId: string };
}) {
    // Serverside initial fetch
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

    if (!codeBlockData.isLoading && codeBlockData.data.length === 0) {
        notFound();
    }

    return <CodeBlockCard codeBlockId={Number(codeBlockId)} initialData={codeBlockData} />;
}
