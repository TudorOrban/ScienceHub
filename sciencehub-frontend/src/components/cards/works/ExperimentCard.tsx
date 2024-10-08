"use client";

import React, { useEffect } from "react";
import { Experiment } from "@/src/types/workTypes";
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import WorkMetadataPanel from "@/src/modules/version-control-system/components/WorkMetadataPanel";
import WorkHeader from "@/src/components/headers/WorkHeader";
import WorkEditableTextFieldBox from "@/src/modules/version-control-system/components/WorkEditableTextFieldBox";
import { useWorkEditModeContext } from "@/src/modules/version-control-system/contexts/WorkEditModeContext";
import PDFViewer from "../card-file-viewers/PDFViewer";
import useExperimentData from "@/src/hooks/fetch/data-hooks/works/useExperimentData";

interface ExperimentCardProps {
    experimentId?: number;
    initialData?: FetchResult<Experiment>;
}

/**
 * Component for displaying a full Experiment. Used in dynamic route.
 */
const ExperimentCard: React.FC<ExperimentCardProps> = ({ experimentId, initialData }) => {
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

    // Initialize edit mode
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
