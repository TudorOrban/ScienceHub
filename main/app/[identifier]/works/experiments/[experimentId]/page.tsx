"use client";

import React from "react";
import useExperimentData from "@/app/hooks/fetch/data-hooks/works/useExperimentData";
import ExperimentCard from "@/components/cards/works/ExperimentCard";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { Experiment } from "@/types/workTypes";

export default function ExperimentPage({
    params,
}: {
    params: { experimentId: string };
}) {
    const experimentData = useExperimentData(params.experimentId, true);
    const emptyExperiment: Experiment = { id: 0, title: "" };

    // console.log("SOAIA", experimentData, params.experimentId);
    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <ExperimentCard
                    experiment={experimentData.data[0] || emptyExperiment}
                />
            </div>
        </div>
    );
}
