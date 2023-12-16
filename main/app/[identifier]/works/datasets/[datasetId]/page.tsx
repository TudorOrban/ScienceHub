import React from "react";
import DatasetCard from "@/components/cards/works/DatasetCard";
import { Dataset } from "@/types/workTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";

export const revalidate = 3600;

export default async function DatasetPage({
    params: { identifier, datasetId },
}: {
    params: { identifier: string, datasetId: string };
}) {
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

    return (
        <DatasetCard
            datasetId={Number(datasetId)}
            initialData={datasetData}
        />
    );
}
