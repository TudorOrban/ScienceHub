import {
    faLock,
    faGlobe,
    faUser,
    faEllipsis,
    faQuoteRight,
    faShare,
    faPlus,
    faClipboardCheck,
    faBookJournalWhills,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ActionButton from "../../elements/ActionButton";
import { Button } from "../../ui/button";
import Link from "next/link";
import WorkField from "../../items/works/WorkField";
import FeatureBox from "@/components/elements/FeatureBox";
import { AIModel } from "@/types/workTypes";

interface AIModelCardProps {
    aiModel: AIModel;
}

const AIModelCard: React.FC<AIModelCardProps> = (props) => {
    const aiModel = props.aiModel || {};

    return (
        <div className="border border-gray-300 rounded-lg  shadow-md w-full">
            {/* Header */}
            <div className="flex justify-between items-start p-4 bg-gray-50 border-b border-gray-300">
                <div>
                    <div className="flex items-center">
                        {aiModel.title && (
                            <h2 className="text-2xl font-bold text-primary mb-4 ml-2 mt-2">
                                {aiModel.title}
                            </h2>
                        )}
                        {aiModel.public === true && (
                            <div className="ml-3 flex items-center text-gray-700">
                                <FontAwesomeIcon
                                    icon={faGlobe}
                                    className="mr-2 mb-1"
                                />
                                <div className="mb-1">Public</div>
                            </div>
                        )}
                        {aiModel.public === false && (
                            <div className="ml-3 flex items-center text-gray-700">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="mr-2 mb-1"
                                />
                                <div className="mb-1">Private</div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center text-gray-600 text-lg ml-2 flex-wrap">
                        <FontAwesomeIcon
                            icon={faUser}
                            style={{
                                marginLeft: "0.2em",
                                marginRight: "0.25em",
                                marginTop: "0em",
                                width: "12px",
                            }}
                            color="#444444"
                        />
                        <span className="whitespace-nowrap block">
                            Main Authors:
                        </span>
                        {(aiModel.users || []).map((user, index) => (
                            <Link
                                key={index}
                                href={`/${user.username}/profile`}
                            >
                                <span className="ml-1 text-blue-600 block">
                                    {index !== (aiModel.users || []).length - 1
                                        ? `${user.fullName}, `
                                        : user.fullName}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-end first-letter:m-2 pb-4 mr-2 mt-2">
                        <FeatureBox
                            feature={{
                                label: "Research Score",
                                icon: faBookJournalWhills,
                                value: aiModel.researchScore?.toString() || "0",
                            }}
                        />
                        <FeatureBox
                            feature={{
                                label: "Citations",
                                icon: faClipboardCheck,
                                value: (
                                    aiModel.citations || []
                                ).length?.toString() || "",
                            }}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-2 mr-2">
                        <ActionButton
                            icon={faEllipsis}
                            tooltipText={"More actions"}
                        />
                        <ActionButton
                            icon={faQuoteRight}
                            tooltipText={"Cite"}
                        />
                        <ActionButton icon={faShare} tooltipText={"Share"} />
                        <Button
                            variant="default"
                            className="bg-blue-600 text-white whitespace-nowrap w-42 lg:mt-0 flex-shrink-0 hover:bg-blue-700"
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="small-icon mr-2"
                            />
                            Add to AI Model
                        </Button>
                    </div>
                </div>
            </div>
            {/* Metrics
            <div className="flex items-center justify-around p-4 bg-gray-50 border-b border-gray-300">
                <span>Views: 124</span>
                <span>Upvotes: 56</span>
                <span>Citations: 3</span>
                <span>Contributors: 4</span>
            </div> */}
            {/* Description */}
            <WorkField
                title="Description"
                content={aiModel.description || ""}
            />

            {/* Associated Works */}
            {/* <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Associated Works:</h3>
                <ul>
                    <li>Dataset: Light Exposure Measurements</li>
                    <li>Analysis: Growth Rate Analysis</li>
                </ul>
            </div> */}
            {/* Citations */}
            {/* <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Citations:</h3>
                <ul>
                    <li>Smith, J. (2020). Plant Growth and Light.</li>
                </ul>
            </div> */}
            {/* Fields of Research */}
            {/* <div className="p-4">
                <h3 className="font-medium text-lg mb-2">
                    Fields of Research:
                </h3>
                <ul>
                    <li>Botany</li>
                    <li>Environmental Science</li>
                </ul>
            </div> */}
            {/* Versions, Submission History, etc */}
            {/* <div className="p-4">
                <h3 className="font-medium text-lg mb-2">
                    Versions and History:
                </h3>
                <ul>
                    <li>Version 1: Initial draft</li>
                    <li>Version 2: Methodology updated</li>
                    <li>Submission history, issues, reviews</li>
                </ul>
            </div> */}
            {/* Supplemental Material */}
            {aiModel.supplementaryMaterial && (
                <div className="border-b border-gray-300 px-4 py-3">
                    <h3 className="font-medium text-lg mb-2">
                        Supplementary Material:
                    </h3>
                    <Link href="#">{aiModel.supplementaryMaterial}</Link>
                </div>
            )}
            {/* License */}
            {aiModel.license && (
                <WorkField title="License" content={aiModel.license} />
            )}
            {/* Grants */}
            {aiModel.grants && (
                <WorkField title="Grants" content={aiModel.grants} />
            )}
        </div>
    );
};

export default AIModelCard;

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
