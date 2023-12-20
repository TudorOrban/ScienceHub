import { WorkSubmission } from "@/types/versionControlTypes";
import { AIModel, FileLocation } from "@/types/workTypes";
import { useEffect, useState } from "react";
import deepEqual from "fast-deep-equal";
import UploadAIModelModal from "@/components/modals/UploadAIModelModal";
import { handleUploadAIModel } from "@/submit-handlers/handleUploadAIModel";

interface AIModelViewerProps {
    aiModel: AIModel;
    selectedWorkSubmission: WorkSubmission;
    isEditModeOn?: boolean;
    selectedWorkSubmissionRefetch?: () => void;
}

const AIModelViewer: React.FC<AIModelViewerProps> = ({
    aiModel,
    selectedWorkSubmission,
    isEditModeOn,
    selectedWorkSubmissionRefetch,
}) => {
    // States
    const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
    const [aiModelLocation, setAiModelLocation] = useState<FileLocation>();

    // File location
    const fileChanges = selectedWorkSubmission?.fileChanges;

    useEffect(() => {
        if (!isEditModeOn && !deepEqual(aiModel.fileLocation, aiModelLocation)) {
            setAiModelLocation(aiModel.fileLocation);
        } else if (fileChanges?.fileToBeAdded) {
            setAiModelLocation(fileChanges.fileToBeAdded);
        } else if (fileChanges?.fileToBeUpdated) {
            setAiModelLocation(fileChanges.fileToBeUpdated);
        }
    }, [
        isEditModeOn,
        aiModel.fileLocation,
        fileChanges?.fileToBeAdded,
        fileChanges?.fileToBeUpdated,
    ]);

    // TODO: Download ai model

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
                    AI Model
                </div>
                <div className="flex items-center space-x-2">
                    {aiModelLocation?.filename && (
                        <button
                            className="p-2 bg-white border border-gray-200 rounded-md shadow-sm "
                            onClick={() => setOpenUploadModal(true)}
                        >
                            Download AI Model
                        </button>
                    )}
                    {isEditModeOn && selectedWorkSubmission.id !== 0 && (
                        <button
                            className="p-2 bg-white border border-gray-200 rounded-md shadow-sm "
                            onClick={() => setOpenUploadModal(true)}
                        >
                            {aiModelLocation?.bucketFilename
                                ? "Reupload AI Model"
                                : "Upload AI Model"}
                        </button>
                    )}
                </div>
            </div>

            <div className="px-4 py-2 break-words">
                {aiModelLocation?.filename ? aiModelLocation?.filename : "No AI Model uploaded"}
            </div>

            {isEditModeOn && openUploadModal && (
                <UploadAIModelModal
                    onUpload={handleUploadAIModel}
                    aiModel={aiModel}
                    setOpenUploadModal={setOpenUploadModal}
                    refetch={selectedWorkSubmissionRefetch}
                    reupload={!!aiModelLocation?.bucketFilename}
                />
            )}
        </div>
    );
};

export default AIModelViewer;
