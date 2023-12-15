import React from "react";
import useExperimentData from "@/hooks/fetch/data-hooks/works/useExperimentData";
import ExperimentCard from "@/components/cards/works/ExperimentCard";
import { Experiment } from "@/types/workTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";

export default async function ExperimentPage({
    params: { experimentId },
}: {
    params: { experimentId: string };
}) {
    const experimentData = await fetchGeneralData<Experiment>(supabase, {
        tableName: "experiments",
        categories: ["users"],
        withCounts: true,
        options: {
            tableRowsIds: [experimentId],
            page: 1,
            itemsPerPage: 10,
            categoriesFetchMode: {
                users: "fields",
            },
            categoriesFields: {
                users: ["id", "username", "full_name"],
            },
        },
    });
    const emptyExperiment: Experiment = { id: 0, title: "" };

    // console.log("SOAIA", experimentData, params.experimentId);
    return <ExperimentCard experiment={experimentData.data[0] || emptyExperiment} isLoading={experimentData.isLoading || false}/>;
}
