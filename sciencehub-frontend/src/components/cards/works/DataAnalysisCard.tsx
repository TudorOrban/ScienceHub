"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataAnalysis } from "@/src/types/workTypes";
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import WorkMetadataPanel from "@/src/modules/version-control-system/components/WorkMetadataPanel";
import WorkHeader from "@/src/components/headers/WorkHeader";
import WorkEditableTextFieldBox from "@/src/modules/version-control-system/components/WorkEditableTextFieldBox";
import { useWorkEditModeContext } from "@/src/modules/version-control-system/contexts/WorkEditModeContext";
import useDataAnalysisData from "@/src/hooks/fetch/data-hooks/works/useDataAnalysisData";
import CodeViewer from "../card-file-viewers/CodeViewer";

interface DataAnalysisCardProps {
    dataAnalysisId?: number;
    initialData?: FetchResult<DataAnalysis>;
}

/**
 * Component for displaying a full Data Analysis. Used in dynamic route.
 */
const DataAnalysisCard: React.FC<DataAnalysisCardProps> = ({ dataAnalysisId, initialData }) => {
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
    const dataAnalysisHookData = useDataAnalysisData(
        dataAnalysisId || 0,
        !!dataAnalysisId,
        initialData
    );
    const dataAnalysis = dataAnalysisHookData.data[0];

    // Initialize edit mode
    useEffect(() => {
        setWorkIdentifier({ workId: dataAnalysisId?.toString() || "", workType: "Data Analysis" });
    }, []);

    return (
        <div>
            {/* Header */}
            <WorkHeader
                work={dataAnalysis}
                isLoading={dataAnalysisHookData.isLoading}
                isEditModeOn={isEditModeOn}
                setIsEditModeOn={setIsEditModeOn}
            />
            <div className="flex items-start justify-between flex-wrap lg:flex-nowrap">
                <div className="w-full mr-8">
                    {/* Description */}
                    {(dataAnalysis.description || isEditModeOn) && (
                        <WorkEditableTextFieldBox
                            label="Description"
                            fieldKey="description"
                            initialVersionContent={dataAnalysis?.description || ""}
                            isEditModeOn={isEditModeOn}
                            selectedWorkSubmission={selectedWorkSubmission}
                            workDeltaChanges={workDeltaChanges}
                            setWorkDeltaChanges={setWorkDeltaChanges}
                            isLoading={dataAnalysisHookData.isLoading}
                            className="w-full m-4"
                        />
                    )}
                    {/* PDF Viewer */}
                    <CodeViewer
                        work={dataAnalysis}
                        selectedWorkSubmission={selectedWorkSubmission}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmissionRefetch={selectedWorkSubmissionRefetch}
                    />
                </div>

                <WorkMetadataPanel
                    metadata={{
                        // doi: "",
                        license: dataAnalysis?.workMetadata?.license,
                        publisher: dataAnalysis?.workMetadata?.publisher,
                        conference: dataAnalysis?.workMetadata?.conference,
                        researchGrants: dataAnalysis?.workMetadata?.researchGrants || [],
                        tags: dataAnalysis?.workMetadata?.tags,
                        keywords: dataAnalysis?.workMetadata?.keywords,
                    }}
                    isEditModeOn={isEditModeOn}
                    selectedWorkSubmission={selectedWorkSubmission}
                    workDeltaChanges={workDeltaChanges}
                    setWorkDeltaChanges={setWorkDeltaChanges}
                    isLoading={dataAnalysisHookData.isLoading}
                />
            </div>
        </div>
    );
};

export default DataAnalysisCard;
