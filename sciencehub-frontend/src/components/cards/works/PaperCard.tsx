"use client";

import React, { useEffect, useState } from "react";
import { Paper } from "@/src/types/workTypes";
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import WorkMetadataPanel from "@/src/modules/version-control-system/components/WorkMetadataPanel";
import WorkHeader from "@/src/components/headers/WorkHeader";
import WorkEditableTextFieldBox from "@/src/modules/version-control-system/components/WorkEditableTextFieldBox";
import { useWorkEditModeContext } from "@/src/modules/version-control-system/contexts/WorkEditModeContext";
import usePaperData from "@/src/hooks/fetch/data-hooks/works/usePaperData";
import PDFViewer from "../card-file-viewers/PDFViewer";

interface PaperCardProps {
    paperId?: number;
    initialData?: FetchResult<Paper>;
}

/**
 * Component for displaying a full Paper. Used in dynamic route.
 */
const PaperCard: React.FC<PaperCardProps> = ({ paperId, initialData }) => {
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
    const paperHookData = usePaperData(paperId || 0, !!paperId, initialData);
    const paper = paperHookData.data[0];

    // Initialize edit mode
    useEffect(() => {
        setWorkIdentifier({ workId: paperId?.toString() || "", workType: "Paper" });
    }, []);

    return (
        <div>
            {/* Header */}
            <WorkHeader
                work={paper}
                isLoading={paperHookData.isLoading}
                isEditModeOn={isEditModeOn}
                setIsEditModeOn={setIsEditModeOn}
            />
            <div className="flex items-start justify-between flex-wrap lg:flex-nowrap">
                <div className="w-full mr-8">
                    {/* Description */}
                    {(paper.description || isEditModeOn) && (
                        <WorkEditableTextFieldBox
                            label="Description"
                            fieldKey="description"
                            initialVersionContent={paper?.description || ""}
                            isEditModeOn={isEditModeOn}
                            selectedWorkSubmission={selectedWorkSubmission}
                            workDeltaChanges={workDeltaChanges}
                            setWorkDeltaChanges={setWorkDeltaChanges}
                            isLoading={paperHookData.isLoading}
                            className="w-full m-4"
                        />
                    )}
                    {(paper.abstract || isEditModeOn) && (
                        <WorkEditableTextFieldBox
                            label="Abstract"
                            fieldKey="abstract"
                            initialVersionContent={paper?.abstract || ""}
                            isEditModeOn={isEditModeOn}
                            selectedWorkSubmission={selectedWorkSubmission}
                            workDeltaChanges={workDeltaChanges}
                            setWorkDeltaChanges={setWorkDeltaChanges}
                            isLoading={paperHookData.isLoading}
                            className="w-full m-4"
                        />
                    )}
                    {/* PDF Viewer */}
                    <PDFViewer
                        work={paper}
                        selectedWorkSubmission={selectedWorkSubmission}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmissionRefetch={selectedWorkSubmissionRefetch}
                    />
                </div>

                <WorkMetadataPanel
                    metadata={{
                        // doi: "",
                        license: paper?.workMetadata?.license,
                        publisher: paper?.workMetadata?.publisher,
                        conference: paper?.workMetadata?.conference,
                        researchGrants: paper?.workMetadata?.researchGrants || [],
                        tags: paper?.workMetadata?.tags,
                        keywords: paper?.workMetadata?.keywords,
                    }}
                    isEditModeOn={isEditModeOn}
                    selectedWorkSubmission={selectedWorkSubmission}
                    workDeltaChanges={workDeltaChanges}
                    setWorkDeltaChanges={setWorkDeltaChanges}
                    isLoading={paperHookData.isLoading}
                />
            </div>
        </div>
    );
};

export default PaperCard;
