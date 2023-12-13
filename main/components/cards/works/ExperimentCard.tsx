"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Experiment } from "@/types/workTypes";
import WorkHeader from "@/components/headers/WorkHeader";
import PDFViewer from "./PDFViewer";
import WorkPanel from "@/components/complex-elements/sidebars/WorkPanel";

interface ExperimentCardProps {
    experiment: Experiment;
    isLoading: boolean;
    refetch?: () => void;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiment, isLoading, refetch }) => {
    return (
        <div>
            {/* Header */}
            <WorkHeader work={experiment} isLoading={isLoading} />
            <div className="flex items-start justify-between">
                <div>
                    <div className="p-4">
                        <div className="font-semibold">Description</div>
                        <div>{experiment?.description || ""}</div>
                    </div>
                    <PDFViewer
                        fileUrl={
                            experiment?.experimentPath || ""
                        }
                    />
                </div>
                <WorkPanel
                    metadata={{
                        doi: "",
                        license: experiment?.license,
                        researchGrants: experiment?.researchGrants || [],
                        keywords: experiment?.keywords,
                        fieldsOfResearch: experiment?.fieldsOfResearch,
                    }}
                />
            </div>
        </div>
    );
};

export default ExperimentCard;

{
    /* Objective/Hypothesis */
}

// {experiment.objective && (
//     <WorkField title="Objective" content={experiment.objective} />
// )}

{
    /* Methodology */
}
{
    /* <div className="border-b border-gray-300 px-4 py-3">
    <h3 className="font-semibold text-lg text-gray-800 mb-4">
        Methodology:
    </h3>
    <ul className="list-decimal list-inside text-gray-700">
        {experiment.methodology?.controlGroups && (
            <li className="mb-2">
                <span className="font-medium">Control Groups:</span>{" "}
                {experiment.methodology.controlGroups}
            </li>
        )}
        {experiment.methodology?.randomization && (
            <li className="mb-2">
                <span className="font-medium">Randomization:</span>{" "}
                {experiment.methodology.randomization}
            </li>
        )}
        {experiment.methodology?.variables && (
            <li className="mb-2">
                <span className="font-medium">Variables:</span>{" "}
                {experiment.methodology.variables}
            </li>
        )}
        {experiment.methodology?.materials && (
            <li className="mb-2">
                <span className="font-medium">Materials:</span>{" "}
                {experiment.methodology.materials}
            </li>
        )}
        {experiment.methodology?.dataCollection && (
            <li className="mb-2">
                <span className="font-medium">
                    Data Collection:
                </span>{" "}
                {experiment.methodology.dataCollection}
            </li>
        )}
        {experiment.methodology?.sampleSelection && (
            <li className="mb-2">
                <span className="font-medium">
                    Sample Selection:
                </span>{" "}
                {experiment.methodology.sampleSelection}
            </li>
        )}
    </ul>
</div> */
}
{
    /* Associated PDF */
}
// {experiment.pdfPath && (
//     <WorkField
//         title="Associated PDF"
//         content={experiment.pdfPath}
//         contentClassName="text-blue-700"
//     />
// )}

{
    /* Associated Works */
}
{
    /* <div className="p-4">
    <h3 className="font-medium text-lg mb-2">Associated Works:</h3>
    <ul>
        <li>Dataset: Light Exposure Measurements</li>
        <li>Analysis: Growth Rate Analysis</li>
    </ul>
</div> */
}
{
    /* Citations */
}
{
    /* <div className="p-4">
    <h3 className="font-medium text-lg mb-2">Citations:</h3>
    <ul>
        <li>Smith, J. (2020). Plant Growth and Light.</li>
    </ul>
</div> */
}
{
    /* Fields of Research */
}
{
    /* <div className="p-4">
    <h3 className="font-medium text-lg mb-2">
        Fields of Research:
    </h3>
    <ul>
        <li>Botany</li>
        <li>Environmental Science</li>
    </ul>
</div> */
}
{
    /* Versions, Submission History, etc */
}
{
    /* <div className="p-4">
    <h3 className="font-medium text-lg mb-2">
        Versions and History:
    </h3>
    <ul>
        <li>Version 1: Initial draft</li>
        <li>Version 2: Methodology updated</li>
        <li>Submission history, issues, reviews</li>
    </ul>
</div> */
}
{
    /* Supplemental Material */
}
// {experiment.supplementaryMaterial && (
//     <div className="border-b border-gray-300 px-4 py-3">
//         <h3 className="font-medium text-lg mb-2">
//             Supplementary Material:
//         </h3>
//         <Link href="#">{experiment.supplementaryMaterial}</Link>
//     </div>
// )}
// {/* License */}
// {experiment.license && (
//     <WorkField title="License" content={experiment.license} />
// )}
// {/* Grants */}
// {experiment.grants && (
//     <WorkField title="Grants" content={experiment.grants} />
// )}

/* EXPERIMENTS
# Title*, #### public/private*, ### date created and modified, ### status: in the works, submitted, community reviewed, blind reviewed*

## cite share other actions buttons
## Metrics: views, upvotes, citations, contributors

## Description:
## Objective/Hypothesis:
## Methodology:
### Control groups & Randomization 
### Variables
### Materials & Equipment
### Data collection
### Sample selection

## Associated pdf 

## Associated works (datasets, data analyses, ai models, code blocks, papers) + associated folders,files
## Citations
## Fields of research

## Versions, submission history, issues, reviews,

## Supplemental material
## License
## Grants
*/

/* DATASETS
# Title*, #### public/private*, ### date created and modified, ### status: in the works, submitted, community reviewed, blind reviewed*

## cite share other actions buttons
## Metrics: views, upvotes, citations, contributors, downloads

## Description:
### Data collection
### Sample selection

## Associated pdf 


## Associated works (datasets, data analyses, ai models, code blocks, papers) + associated folders,files
## Citations
## Fields of research

## Versions, submission history, issues, reviews,

## Supplemental material
## License
## Grants
*/
