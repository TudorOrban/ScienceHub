"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CodeBlock } from "@/types/workTypes";
import { FetchResult } from "@/services/fetch/fetchGeneralData";
import WorkMetadataPanel from "@/version-control-system/components/WorkMetadataPanel";
import WorkHeader from "@/components/headers/WorkHeader";
import EditableTextFieldBox from "@/version-control-system/components/EditableTextFieldBox";
import { useWorkEditModeContext } from "@/contexts/search-contexts/version-control/WorkEditModeContext";
import useCodeBlockData from "@/hooks/fetch/data-hooks/works/useCodeBlockData";
import PDFViewer from "../card-file-viewers/PDFViewer";
import CodeViewer from "../card-file-viewers/CodeViewer";

interface CodeBlockCardProps {
    codeBlockId?: number;
    initialData?: FetchResult<CodeBlock>;
}

const CodeBlockCard: React.FC<CodeBlockCardProps> = ({
    codeBlockId,
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

    const codeBlockHookData = useCodeBlockData(codeBlockId || 0, !!codeBlockId, initialData);
    const codeBlock = codeBlockHookData.data[0];

    useEffect(() => {
        setWorkIdentifier({ workId: codeBlockId?.toString() || "", workType: "Code Block" });
    }, []);

    return (
        <div>
            {/* Header */}
            <WorkHeader
                work={codeBlock}
                isLoading={codeBlockHookData.isLoading}
                isEditModeOn={isEditModeOn}
                setIsEditModeOn={setIsEditModeOn}
            />
            <div className="flex items-start justify-between flex-wrap lg:flex-nowrap">
                <div className="w-full mr-8">
                    {/* Description */}
                    {(codeBlock.description || isEditModeOn) && (
                        <EditableTextFieldBox
                        label="Description"
                        fieldKey="description"
                        initialVersionContent={codeBlock?.description || ""}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmission={selectedWorkSubmission}
                        workDeltaChanges={workDeltaChanges}
                        setWorkDeltaChanges={setWorkDeltaChanges}
                        isLoading={codeBlockHookData.isLoading}
                        className="w-full m-4"
                    />
                    )}
                    {/* PDF Viewer */}
                    <CodeViewer
                        work={codeBlock}
                        selectedWorkSubmission={selectedWorkSubmission}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmissionRefetch={selectedWorkSubmissionRefetch}
                    />
                </div>

                <WorkMetadataPanel
                    metadata={{
                        // doi: "",
                        license: codeBlock?.workMetadata?.license,
                        publisher: codeBlock?.workMetadata?.publisher,
                        conference: codeBlock?.workMetadata?.conference,
                        researchGrants: codeBlock?.workMetadata?.researchGrants || [],
                        tags: codeBlock?.workMetadata?.tags,
                        keywords: codeBlock?.workMetadata?.keywords,
                    }}
                    isEditModeOn={isEditModeOn}
                    selectedWorkSubmission={selectedWorkSubmission}
                    workDeltaChanges={workDeltaChanges}
                    setWorkDeltaChanges={setWorkDeltaChanges}
                    isLoading={codeBlockHookData.isLoading}
                />
            </div>
        </div>
    );
};

export default CodeBlockCard;
