"use client";

import React from "react";
import useDatasetData from "@/hooks/fetch/data-hooks/works/useDatasetData";
import Breadcrumb from "@/components/elements/Breadcrumb";
import DatasetCard from "@/components/cards/works/DatasetCard";
import { Dataset } from "@/types/workTypes";

export default function DatasetPage({
    params,
}: {
    params: { datasetId: string };
}) {
    const datasetData = useDatasetData(Number(params.datasetId), true);
    const emptyDataset: Dataset = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                {/* <DatasetCard datasetId={Number(datasetData.data[0].id || 0) || emptyDataset.id} /> */}
            </div>
        </div>
    );
}
