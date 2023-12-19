"use client";

import React, { useEffect, useState } from "react";
import { Dataset, FileLocation } from "@/types/workTypes";
import WorkHeader from "@/components/headers/WorkHeader";
import WorkPanel from "@/components/complex-elements/sidebars/WorkPanel";
// import supabase from "@/utils/supabase";
import UploadDatasetModal from "@/components/modals/UploadDatasetModal";
import useDatasetData from "@/hooks/fetch/data-hooks/works/useDatasetData";
import { FetchResult } from "@/services/fetch/fetchGeneralData";
import { useWorkEditModeContext } from "@/contexts/search-contexts/version-control/WorkEditModeContext";
import { handleUploadDataset } from "@/submit-handlers/handleUploadDataset";
import deepEqual from "fast-deep-equal";
import EditableTextFieldBox from "@/version-control-system/components/EditableTextFieldBox";
import EditableTextField from "@/version-control-system/components/EditableTextField";
import WorkMetadataPanel from "@/version-control-system/components/WorkMetadataPanel";

interface DatasetCardProps {
    datasetId?: number;
    initialData?: FetchResult<Dataset>;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ datasetId, initialData }) => {
    // States
    const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
    const [datasetLocation, setDatasetLocation] = useState<FileLocation>();

    // Work edit mode context
    const {
        isEditModeOn,
        setIsEditModeOn,
        setWorkIdentifier,
        selectedWorkSubmission,
        setSelectedWorkSubmission,
        selectedWorkSubmissionRefetch,
    } = useWorkEditModeContext();

    // Custom hook for hydrating initial server fetch
    const datasetHookData = useDatasetData(datasetId || 0, !!datasetId, initialData);
    const dataset = datasetHookData.data[0];

    useEffect(() => {
        setWorkIdentifier({ workId: datasetId?.toString() || "", workType: "Dataset" });
    }, []);

    // File location
    const delta = selectedWorkSubmission?.workDelta;

    useEffect(() => {
        if (!isEditModeOn && !deepEqual(dataset.fileLocation, datasetLocation)) {
            setDatasetLocation(dataset.fileLocation);
        } else if (delta?.fileToBeAdded) {
            setDatasetLocation(delta.fileToBeAdded);
        } else if (delta?.fileToBeUpdated) {
            setDatasetLocation(delta.fileToBeUpdated);
        }
    }, [isEditModeOn, dataset.fileLocation, delta?.fileToBeAdded, delta?.fileToBeUpdated]);

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
                {/* Description */}

                <div className="w-full mr-8">
                    <EditableTextFieldBox
                        label="Description"
                        fieldKey="description"
                        initialVersionContent={dataset?.description || ""}
                        isEditModeOn={isEditModeOn}
                        selectedWorkSubmission={selectedWorkSubmission}
                        isLoading={datasetHookData.isLoading}
                        className="w-full m-4"
                    />
                    <div className="w-full border border-gray-200 rounded-lg shadow-md m-4">
                        <div
                            style={{
                                backgroundColor: "var(--page-header-bg-color)",
                            }}
                            className="flex items-center justify-between  py-2 px-4 rounded-t-lg border-b border-gray-200"
                        >
                            <div
                                className="text-gray-900 text-lg font-semibold"
                                style={{
                                    fontWeight: "500",
                                    fontSize: "18px",
                                }}
                            >
                                Dataset
                            </div>
                            <div className="flex items-center space-x-2">
                                {dataset.fileLocation?.filename && (
                                    <button
                                        className="p-2 bg-white border border-gray-200 rounded-md shadow-sm "
                                        onClick={() => setOpenUploadModal(true)}
                                    >
                                        Download Dataset
                                    </button>
                                )}
                                {isEditModeOn && selectedWorkSubmission.id !== 0 && (
                                    <button
                                        className="p-2 bg-white border border-gray-200 rounded-md shadow-sm "
                                        onClick={() => setOpenUploadModal(true)}
                                    >
                                        {dataset.fileLocation?.bucketFilename
                                            ? "Reupload Dataset"
                                            : "Upload Dataset"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="px-4 py-2 break-words">
                            {datasetLocation ? datasetLocation?.filename : "No dataset uploaded"}
                        </div>
                    </div>
                    {isEditModeOn && openUploadModal && (
                        <div>
                            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                            <UploadDatasetModal
                                onUpload={handleUploadDataset}
                                dataset={dataset}
                                setOpenUploadModal={setOpenUploadModal}
                                refetch={selectedWorkSubmissionRefetch}
                                reupload={!!dataset.fileLocation?.bucketFilename}
                            />
                        </div>
                    )}
                </div>

                <WorkMetadataPanel
                    metadata={{
                        doi: "",
                        license: dataset?.workMetadata?.license,
                        publisher: dataset?.workMetadata?.publisher,
                        conference: dataset?.workMetadata?.conference,
                        researchGrants: dataset?.workMetadata?.researchGrants || [],
                        tags: dataset?.workMetadata?.tags,
                        keywords: dataset?.workMetadata?.keywords,
                    }}
                    isEditModeOn={isEditModeOn}
                    selectedWorkSubmission={selectedWorkSubmission}
                    isLoading={datasetHookData.isLoading}
                />
            </div>
        </div>
    );
};

export default DatasetCard;
