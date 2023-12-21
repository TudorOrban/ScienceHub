
import React from "react";
import DataAnalysisCard from "@/components/cards/works/DataAnalysisCard";
import { DataAnalysis } from "@/types/workTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export default async function DataAnalysisPage({
    params: {dataAnalysisId},
}: {
    params: { dataAnalysisId: string };
}) {
    const dataAnalysisData = await fetchGeneralData<DataAnalysis>(supabase, {
        tableName: "data_analyses",
        categories: ["users", "projects"],
        options: {
            tableRowsIds: [dataAnalysisId],
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

    if (!dataAnalysisData.isLoading && dataAnalysisData.data.length === 0) {
        notFound();
    }

    return <DataAnalysisCard dataAnalysisId={Number(dataAnalysisId)} initialData={dataAnalysisData} />;
}
