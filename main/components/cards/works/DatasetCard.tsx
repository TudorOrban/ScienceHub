"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Dataset } from "@/types/workTypes";
import WorkHeader from "@/components/headers/WorkHeader";
import WorkPanel from "@/components/complex-elements/sidebars/WorkPanel";
// import supabase from "@/utils/supabase";
import UploadDatasetModal from "@/components/modals/UploadDatasetModal";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import ToasterManager, { Operation } from "@/components/forms/form-elements/ToasterManager";
import { toast } from "@/components/ui/use-toast";
import TextFieldBox from "@/components/elements/EditableTextFieldBox";
import useDatasetData from "@/hooks/fetch/data-hooks/works/useDatasetData";
import { FetchResult } from "@/services/fetch/fetchGeneralData";
import { useDeleteGeneralBucketFile } from "@/hooks/delete/useDeleteGeneralBucketFile";
import { useWorkEditModeContext } from "@/contexts/search-contexts/version-control/WorkEditModeContext";

interface DatasetCardProps {
    identifier?: string;
    datasetId?: number;
    initialData?: FetchResult<Dataset>;
    revalidatePath: (path: string) => void;
}

const DatasetCard: React.FC<DatasetCardProps> = ({
    identifier,
    datasetId,
    initialData,
    revalidatePath,
}) => {
    // States
    const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
    
    // Work edit mode context
    const {
        isEditModeOn,
        setIsEditModeOn,
        setWorkIdentifier,
        selectedWorkSubmission,
        setSelectedWorkSubmission,
    } = useWorkEditModeContext();
    
    // Custom hook for hydrating initial server fetch
    const datasetHookData = useDatasetData(datasetId || 0, !!datasetId, initialData);
    const dataset = datasetHookData.data[0];

    useEffect(() => {
        setWorkIdentifier({ workId: datasetId?.toString() || "", workType: "Dataset" });
    }, []);

    // Dataset upload
    const updateDataset = useUpdateGeneralData();
    const deleteBucketDataset = useDeleteGeneralBucketFile();

    const handleFileUpload = async (file: File, datasetType: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("datasetType", datasetType);

        if (!datasetId) {
            throw new Error("Dataset id not available");
        }

        try {
            if (dataset.datasetLocation?.bucketFilename) {
                const deletedDataset = await deleteBucketDataset.mutateAsync({
                    bucketName: "datasets",
                    filePaths: [dataset.datasetLocation?.bucketFilename],
                });
            }

            const response = await fetch("/api/rest/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("File upload failed");
            }

            const data: { bucketFilename?: string; message: string } = await response.json();

            if (data?.bucketFilename) {
                const updatedDataset = await updateDataset.mutateAsync({
                    tableName: "datasets",
                    identifier: datasetId || 0,
                    identifierField: "id",
                    updateFields: {
                        dataset_location: {
                            dataset_name: file.name,
                            dataset_type: datasetType,
                            bucket_filename: data?.bucketFilename,
                        },
                    },
                });

                const updatedId = (updatedDataset as any).id;

                const updateDatasetOperation: Operation = {
                    operationType: "update",
                    entityType: "Dataset",
                    id: (updatedDataset as any).id,
                };

                // Display operation outcome
                toast({
                    action: (
                        <ToasterManager
                            operations={[updateDatasetOperation]}
                            mainOperation={updateDatasetOperation}
                            customSuccessMessage="Dataset has been uploaded successfully"
                        />
                    ),
                });

                // If successful, close modal, refetch data and revalidate path
                if (updatedId) {
                    setOpenUploadModal(false);
                    datasetHookData.refetch?.();
                    if (identifier) {
                        revalidatePath(`/${identifier}/works/${datasetId}`);
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error uploading dataset", error.message);
            } else {
                console.log("Error uploading dataset: ", error);
            }
        }
    };

    return (
        <div>
            {/* Header */}
            <WorkHeader
                work={dataset}
                isLoading={datasetHookData.isLoading}
                isEditModeOn={isEditModeOn}
                setIsEditModeOn={setIsEditModeOn}
            />
            <div className="flex items-start justify-between">
                {/* Description */}

                <div className="w-full mr-8">
                    <TextFieldBox
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
                                {dataset.datasetLocation?.datasetName && (
                                    <button
                                        className="p-2 bg-white border border-gray-200 rounded-md shadow-sm "
                                        onClick={() => setOpenUploadModal(true)}
                                    >
                                        Download Dataset
                                    </button>
                                )}
                                <button
                                    className="p-2 bg-white border border-gray-200 rounded-md shadow-sm "
                                    onClick={() => setOpenUploadModal(true)}
                                >
                                    {dataset.datasetLocation?.bucketFilename
                                        ? "Reupload Dataset"
                                        : "Upload Dataset"}
                                </button>
                            </div>
                        </div>

                        {dataset.datasetLocation?.datasetName && (
                            <div className="px-4 py-2 break-words">
                                {dataset.datasetLocation?.datasetName}
                            </div>
                        )}
                    </div>
                    {openUploadModal && (
                        <div>
                            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                            <UploadDatasetModal
                                onUpload={handleFileUpload}
                                setOpenUploadModal={setOpenUploadModal}
                                reupload={!!dataset.datasetLocation?.bucketFilename}
                            />
                        </div>
                    )}
                </div>

                <WorkPanel
                    metadata={{
                        doi: "",
                        license: dataset?.license,
                        researchGrants: dataset?.researchGrants || [],
                        keywords: dataset?.keywords,
                        fieldsOfResearch: dataset?.fieldsOfResearch,
                    }}
                />
            </div>
        </div>
    );
};

export default DatasetCard;
