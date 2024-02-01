import React from "react";
import PaperCard from "@/components/cards/works/PaperCard";
import { Paper } from "@/types/workTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function PaperPage({ params: { paperId } }: { params: { paperId: string } }) {
    // Serverside initial fetch
    const paperData = await fetchGeneralData<Paper>(supabase, {
        tableName: "papers",
        categories: ["users", "projects"],
        options: {
            tableRowsIds: [paperId],
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

    if (!paperData.isLoading && paperData.data.length === 0) {
        notFound();
    }

    return <PaperCard paperId={Number(paperId)} initialData={paperData} />;
}
