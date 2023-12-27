"use client";

import React, { useEffect, useState } from "react";
import { AIModel } from "@/types/workTypes";
import WorkHeader from "@/components/headers/WorkHeader";
import useAIModelData from "@/hooks/fetch/data-hooks/works/useAIModelData";
import { FetchResult } from "@/services/fetch/fetchGeneralData";
import { useWorkEditModeContext } from "@/version-control-system/contexts/WorkEditModeContext";
import WorkEditableTextFieldBox from "@/version-control-system/components/WorkEditableTextFieldBox";
import WorkMetadataPanel from "@/version-control-system/components/WorkMetadataPanel";
import AIModelViewer from "../card-file-viewers/AIModelViewer";
``
interface AIModelCardProps {
    aiModelId?: number;
    initialData?: FetchResult<AIModel>;
}

const AIModelCard: React.FC<AIModelCardProps> = ({ aiModelId, initialData }) => {

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
    const aiModelHookData = useAIModelData(aiModelId || 0, !!aiModelId, initialData);
    const aiModel = aiModelHookData.data[0];

    console.log("QWEWQ", aiModel);
    useEffect(() => {
        setWorkIdentifier({ workId: aiModelId?.toString() || "", workType: "AI Model" });
    }, []);

    return (
        <div>
            {/* Header */}
            <WorkHeader
                work={aiModel}
                isLoading={aiModelHookData.isLoading}
                isEditModeOn={isEditModeOn}
                setIsEditModeOn={setIsEditModeOn}
            />
            <div className="flex items-start justify-between flex-wrap lg:flex-nowrap">
                <div className="w-full mr-8">
                    {/* Description */}
                    <WorkEditableTextFieldBox
                        label="Description"
                        fieldKey="description"
                        initialVersionContent={aiModel?.description || ""}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmission={selectedWorkSubmission}
                        workDeltaChanges={workDeltaChanges}
                        setWorkDeltaChanges={setWorkDeltaChanges}
                        isLoading={aiModelHookData.isLoading}
                        className="w-full m-4"
                    />
                    {/* AI Model Viewer */}
                    <AIModelViewer
                        aiModel={aiModel}
                        selectedWorkSubmission={selectedWorkSubmission}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmissionRefetch={selectedWorkSubmissionRefetch}
                    />
                </div>

                <WorkMetadataPanel
                    metadata={{
                        // doi: "",
                        license: aiModel?.workMetadata?.license,
                        publisher: aiModel?.workMetadata?.publisher,
                        conference: aiModel?.workMetadata?.conference,
                        researchGrants: aiModel?.workMetadata?.researchGrants || [],
                        tags: aiModel?.workMetadata?.tags,
                        keywords: aiModel?.workMetadata?.keywords,
                    }}
                    isEditModeOn={isEditModeOn}
                    selectedWorkSubmission={selectedWorkSubmission}
                    workDeltaChanges={workDeltaChanges}
                    setWorkDeltaChanges={setWorkDeltaChanges}
                    isLoading={aiModelHookData.isLoading}
                />
            </div>
        </div>
    );
};

export default AIModelCard;
