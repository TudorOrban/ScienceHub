"use client";

import React from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { Experiment } from "@/types/workTypes";
import useExperimentData from "@/app/hooks/fetch/data-hooks/works/useExperimentData";
import ExperimentCard from "@/components/cards/works/ExperimentCard";

export default function DatasetPage({
    params,
}: {
    params: { experimentId: string };
}) {
    const experimentData = useExperimentData(params.experimentId, true);
    const emptyExperiment: Experiment = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <ExperimentCard experiment={experimentData.data[0] || emptyExperiment} />
            </div>
        </div>
    );
}
