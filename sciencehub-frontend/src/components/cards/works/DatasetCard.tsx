"use client";

import React, { useEffect, useState } from "react";
import { Dataset } from "@/src/types/workTypes";
import WorkHeader from "@/src/components/headers/WorkHeader";
import useDatasetData from "@/src/hooks/fetch/data-hooks/works/useDatasetData";
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import { useWorkEditModeContext } from "@/src/modules/version-control-system/contexts/WorkEditModeContext";
import WorkEditableTextFieldBox from "@/src/modules/version-control-system/components/WorkEditableTextFieldBox";
import WorkMetadataPanel from "@/src/modules/version-control-system/components/WorkMetadataPanel";
import DatasetViewer from "../card-file-viewers/DatasetViewer";
``;
interface DatasetCardProps {
    datasetId?: number;
    initialData?: FetchResult<Dataset>;
}

/**
 * Component for displaying a full Dataset. Used in dynamic route.
 */
const DatasetCard: React.FC<DatasetCardProps> = ({ datasetId, initialData }) => {
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
    const datasetHookData = useDatasetData(datasetId || 0, !!datasetId, initialData);
    const dataset = datasetHookData.data[0];

    // Initialize edit mode
    useEffect(() => {
        setWorkIdentifier({ workId: datasetId?.toString() || "", workType: "Dataset" });
    }, []);

    return (
        <div>
            {/* Header */}
            <WorkHeader
                work={dataset}
                isLoading={datasetHookData.isLoading}
                isEditModeOn={isEditModeOn}
                setIsEditModeOn={setIsEditModeOn}
            />
            <div className="flex items-start justify-between flex-wrap lg:flex-nowrap">
                <div className="w-full mr-8">
                    {/* Description */}
                    <WorkEditableTextFieldBox
                        label="Description"
                        fieldKey="description"
                        initialVersionContent={dataset?.description || ""}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmission={selectedWorkSubmission}
                        workDeltaChanges={workDeltaChanges}
                        setWorkDeltaChanges={setWorkDeltaChanges}
                        isLoading={datasetHookData.isLoading}
                        className="w-full m-4"
                    />
                    {/* Dataset Viewer */}
                    <DatasetViewer
                        dataset={dataset}
                        selectedWorkSubmission={selectedWorkSubmission}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmissionRefetch={selectedWorkSubmissionRefetch}
                    />
                </div>

                <WorkMetadataPanel
                    metadata={{
                        // doi: "",
                        license: dataset?.workMetadata?.license,
                        publisher: dataset?.workMetadata?.publisher,
                        conference: dataset?.workMetadata?.conference,
                        researchGrants: dataset?.workMetadata?.researchGrants || [],
                        tags: dataset?.workMetadata?.tags,
                        keywords: dataset?.workMetadata?.keywords,
                    }}
                    isEditModeOn={isEditModeOn}
                    selectedWorkSubmission={selectedWorkSubmission}
                    workDeltaChanges={workDeltaChanges}
                    setWorkDeltaChanges={setWorkDeltaChanges}
                    isLoading={datasetHookData.isLoading}
                />
            </div>
        </div>
    );
};

export default DatasetCard;
