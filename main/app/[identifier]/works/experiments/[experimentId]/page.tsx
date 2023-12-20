import React from "react";
import ExperimentCard from "@/components/cards/works/ExperimentCard";
import { Experiment } from "@/types/workTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export default async function ExperimentPage({
    params: { experimentId },
}: {
    params: { experimentId: string };
}) {
    const experimentData = await fetchGeneralData<Experiment>(supabase, {
        tableName: "experiments",
        categories: ["users", "projects"],
        options: {
            tableRowsIds: [experimentId],
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

    if (!experimentData.isLoading && experimentData.data.length === 0) {
        notFound();
    }
    
    return <ExperimentCard experimentId={Number(experimentId)} initialData={experimentData} />;
    
}
