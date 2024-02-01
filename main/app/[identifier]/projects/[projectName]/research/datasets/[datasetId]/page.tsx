import React from "react";
import DatasetCard from "@/components/cards/works/DatasetCard";
import { Dataset } from "@/types/workTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function DatasetPage({
    params: { identifier, datasetId },
}: {
    params: { identifier: string; datasetId: string };
}) {
    // Serverside initial fetch
    const datasetData = await fetchGeneralData<Dataset>(supabase, {
        tableName: "datasets",
        categories: ["users", "projects"],
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
                projects: ["id", "name", "title"],
            },
        },
    });

    // const isAuthorized = datasetData.data[0].public || ()

    if (!datasetData.isLoading && datasetData.data.length === 0) {
        notFound();
    }

    return <DatasetCard datasetId={Number(datasetId)} initialData={datasetData} />;
}
