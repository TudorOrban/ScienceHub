"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Experiment } from "@/types/workTypes";
import { FetchResult } from "@/services/fetch/fetchGeneralData";
import WorkMetadataPanel from "@/version-control-system/components/WorkMetadataPanel";
import WorkHeader from "@/components/headers/WorkHeader";
import WorkEditableTextFieldBox from "@/version-control-system/components/WorkEditableTextFieldBox";
import { useWorkEditModeContext } from "@/version-control-system/contexts/WorkEditModeContext";
import PDFViewer from "../card-file-viewers/PDFViewer";
import useExperimentData from "@/hooks/fetch/data-hooks/works/useExperimentData";

interface ExperimentCardProps {
    experimentId?: number;
    initialData?: FetchResult<Experiment>;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
    experimentId,
    initialData,
}) => {

    // Work edit mode context
    const {
        isEditModeOn,
        setIsEditModeOn,
        setWorkIdentifier,
        selectedWorkSubmission,
        selectedWorkSubmissionRefetch,
        workDeltaChanges,
        setWorkDeltaChanges,
    } = useWorkEditModeContext();
    
    // Custom hook for hydrating initial server fetch
    
    const experimentHookData = useExperimentData(experimentId || 0, !!experimentId, initialData);
    const experiment = experimentHookData.data[0];

    useEffect(() => {
        setWorkIdentifier({ workId: experimentId?.toString() || "", workType: "Experiment" });
    }, []);

    return (
        <div>
            {/* Header */}
            <WorkHeader
                work={experiment}
                isLoading={experimentHookData.isLoading}
                isEditModeOn={isEditModeOn}
                setIsEditModeOn={setIsEditModeOn}
            />
            <div className="flex items-start justify-between flex-wrap lg:flex-nowrap">
                <div className="w-full mr-8">
                    {/* Description */}
                    {(experiment.description || isEditModeOn) && (
                        <WorkEditableTextFieldBox
                        label="Description"
                        fieldKey="description"
                        initialVersionContent={experiment?.description || ""}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmission={selectedWorkSubmission}
                        workDeltaChanges={workDeltaChanges}
                        setWorkDeltaChanges={setWorkDeltaChanges}
                        isLoading={experimentHookData.isLoading}
                        className="w-full m-4"
                    />
                    )}
                    {/* {(experiment.methodology || isEditModeOn) && (
                        <WorkEditableTextFieldBox
                        label="Methodology"
                        fieldKey="methodology"
                        initialVersionContent={experiment?.methodology || ""}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmission={selectedWorkSubmission}
                        workDeltaChanges={workDeltaChanges}
                        setWorkDeltaChanges={setWorkDeltaChanges}
                        isLoading={experimentHookData.isLoading}
                        className="w-full m-4"
                    />
                    )} */}
                    {/* PDF Viewer */}
                    <PDFViewer
                        work={experiment}
                        selectedWorkSubmission={selectedWorkSubmission}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmissionRefetch={selectedWorkSubmissionRefetch}
                    />
                </div>

                <WorkMetadataPanel
                    metadata={{
                        // doi: "",
                        license: experiment?.workMetadata?.license,
                        publisher: experiment?.workMetadata?.publisher,
                        conference: experiment?.workMetadata?.conference,
                        researchGrants: experiment?.workMetadata?.researchGrants || [],
                        tags: experiment?.workMetadata?.tags,
                        keywords: experiment?.workMetadata?.keywords,
                    }}
                    isEditModeOn={isEditModeOn}
                    selectedWorkSubmission={selectedWorkSubmission}
                    workDeltaChanges={workDeltaChanges}
                    setWorkDeltaChanges={setWorkDeltaChanges}
                    isLoading={experimentHookData.isLoading}
                />
            </div>
        </div>
    );
};

export default ExperimentCard;
