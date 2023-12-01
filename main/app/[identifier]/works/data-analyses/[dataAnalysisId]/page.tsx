"use client";

import React from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import useDataAnalysisData from "@/app/hooks/fetch/data-hooks/works/useDataAnalysisData";
import DataAnalysisCard from "@/components/cards/works/DataAnalysisCard";
import { DataAnalysis } from "@/types/workTypes";

export default function DataAnalysisPage({
    params,
}: {
    params: { dataAnalysisId: string };
}) {
    const dataAnalysisData = useDataAnalysisData(
        params.dataAnalysisId, true
    );
    const emptyDataAnalysis: DataAnalysis = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <DataAnalysisCard
                    dataAnalysis={dataAnalysisData.data[0] || emptyDataAnalysis}
                />
            </div>
        </div>
    );
}
