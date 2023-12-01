"use client";

import React from "react";
import useDatasetData from "@/app/hooks/fetch/data-hooks/works/useDatasetData";
import Breadcrumb from "@/components/elements/Breadcrumb";
import DatasetCard from "@/components/cards/works/DatasetCard";
import { Dataset } from "@/types/workTypes";

export default function DatasetPage({
    params,
}: {
    params: { datasetId: string };
}) {
    const datasetData = useDatasetData(params.datasetId, true);
    const emptyDataset: Dataset = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <DatasetCard dataset={datasetData.data[0] || emptyDataset} />
            </div>
        </div>
    );
}
