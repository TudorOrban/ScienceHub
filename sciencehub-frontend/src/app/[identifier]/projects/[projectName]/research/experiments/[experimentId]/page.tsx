import React from "react";
import ExperimentCard from "@/src/components/cards/works/ExperimentCard";
import { Experiment } from "@/src/types/workTypes";
import { fetchGeneralData } from "@/src/services/fetch/fetchGeneralData";
import supabase from "@/src/utils/supabase";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function ExperimentPage({
    params: { experimentId },
}: {
    params: { experimentId: string };
}) {
    // Serverside initial fetch
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
