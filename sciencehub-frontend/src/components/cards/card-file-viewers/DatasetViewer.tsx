import { WorkSubmission } from "@/src/types/versionControlTypes";
import { Dataset, FileLocation } from "@/src/types/workTypes";
import { useEffect, useState } from "react";
import deepEqual from "fast-deep-equal";
import UploadDatasetModal from "@/src/components/modals/UploadDatasetModal";
import { handleUploadDataset } from "@/src/services/submit-handlers/file-uploads/handleUploadDataset";

interface DatasetViewerProps {
    dataset: Dataset;
    selectedWorkSubmission: WorkSubmission;
    isEditModeOn?: boolean;
    selectedWorkSubmissionRefetch?: () => void;
}

/**
 * Dataset viewer (preview dataset to be added). Used in DatasetCard.
 * Includes upload modal for storage to Supabase bucket.
 */
const DatasetViewer: React.FC<DatasetViewerProps> = ({
    dataset,
    selectedWorkSubmission,
    isEditModeOn,
    selectedWorkSubmissionRefetch,
}) => {
    // States
    const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
    const [datasetLocation, setDatasetLocation] = useState<FileLocation>();

    // File location
    const fileChanges = selectedWorkSubmission?.fileChanges;

    useEffect(() => {
        if (!isEditModeOn && !deepEqual(dataset.fileLocation, datasetLocation)) {
            setDatasetLocation(dataset.fileLocation);
        } else if (fileChanges?.fileToBeAdded) {
            setDatasetLocation(fileChanges.fileToBeAdded);
        } else if (fileChanges?.fileToBeUpdated) {
            setDatasetLocation(fileChanges.fileToBeUpdated);
        }
    }, [
        isEditModeOn,
        dataset.fileLocation,
        fileChanges?.fileToBeAdded,
        fileChanges?.fileToBeUpdated,
    ]);

    // TODO: Download dataset

    return (
        <div className="w-full border border-gray-200 rounded-lg shadow-md m-4">
            <div
                style={{
                    backgroundColor: "var(--page-header-bg-color)",
                }}
                className="flex items-center justify-between  py-2 px-4 rounded-t-lg border-b border-gray-300"
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
                    {datasetLocation?.filename && (
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
                            {datasetLocation?.bucketFilename
                                ? "Reupload Dataset"
                                : "Upload Dataset"}
                        </button>
                    )}
                </div>
            </div>

            <div className="px-4 py-2 break-words">
                {datasetLocation ? datasetLocation?.filename : "No dataset uploaded"}
            </div>

            {isEditModeOn && openUploadModal && (
                <UploadDatasetModal
                    onUpload={handleUploadDataset}
                    dataset={dataset}
                    setOpenUploadModal={setOpenUploadModal}
                    refetch={selectedWorkSubmissionRefetch}
                    reupload={!!datasetLocation?.bucketFilename}
                />
            )}
        </div>
    );
};

export default DatasetViewer;
