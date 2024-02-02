// Component that uses react-pdf to display a PDF
import dynamic from "next/dynamic";
const Worker = dynamic(() => import("@react-pdf-viewer/core").then((mod) => mod.Worker));
const Viewer = dynamic(() => import("@react-pdf-viewer/core").then((mod) => mod.Viewer));
import { searchPlugin } from "@react-pdf-viewer/search";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { getFilePlugin } from "@react-pdf-viewer/get-file";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useEffect, useState } from "react";
import { FileLocation, Work } from "@/types/workTypes";
import { WorkSubmission } from "@/types/versionControlTypes";
import deepEqual from "fast-deep-equal";
import UploadPDFModal from "@/components/modals/UploadPDFModal";
import { handleUploadPDF } from "@/submit-handlers/file-uploads/handleUploadPDF";

interface PDFViewerProps {
    work: Work;
    selectedWorkSubmission: WorkSubmission;
    isEditModeOn?: boolean;
    selectedWorkSubmissionRefetch?: () => void;
}

/**
 * PDF viewer React PDF Viewer. Used in ExperimentCard and PaperCard.
 * Includes upload modal for storage to Supabase bucket.
 */
const PDFViewer: React.FC<PDFViewerProps> = ({
    work,
    selectedWorkSubmission,
    isEditModeOn,
    selectedWorkSubmissionRefetch,
}) => {
    // States
    const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
    const [loadPdf, setLoadPdf] = useState<boolean>(false);
    const [pdfLocation, setPdfLocation] = useState<FileLocation>();

    // File location
    const fileChanges = selectedWorkSubmission?.fileChanges;

    useEffect(() => {
        if (!isEditModeOn && !deepEqual(work.fileLocation, pdfLocation)) {
            setPdfLocation(work.fileLocation);
        } else if (fileChanges?.fileToBeAdded) {
            setPdfLocation(fileChanges.fileToBeAdded);
        } else if (fileChanges?.fileToBeUpdated) {
            setPdfLocation(fileChanges.fileToBeUpdated);
        }
    }, [isEditModeOn, work.fileLocation, fileChanges?.fileToBeAdded, fileChanges?.fileToBeUpdated]);

    const { bucketFilename, fileType } = pdfLocation || { bucketFilename: "", fileType: "" };

    // Generate URL for download and open actions
    const fileActionUrl = (action: string) =>
        `/api/rest/download?filename=${encodeURIComponent(
            bucketFilename
        )}&fileType=${fileType}&action=${action}`;

    // Handle download
    const handleDownload = () => {
        window.location.href = fileActionUrl("download");
    };

    // Handle open in new window
    const handleOpenInNewWindow = () => {
        window.open(fileActionUrl("open"), "_blank");
    };

    // React-pdf-viewer plugins
    const searchPluginInstance = searchPlugin();
    const zoomPluginInstance = zoomPlugin();
    const getFilePluginInstance = getFilePlugin();

    return (
        <div className="w-full border border-gray-300 rounded-lg shadow-md m-4">
            <div
                style={{
                    backgroundColor: "var(--page-header-bg-color)",
                }}
                className="flex items-center justify-between py-2 px-4 border-b border-gray-300"
            >
                <div
                    className="text-gray-900 text-lg font-semibold ml-2"
                    style={{
                        fontWeight: "500",
                        fontSize: "18px",
                    }}
                >
                    {work?.workType}
                </div>
                {pdfLocation?.bucketFilename && (
                    <div className="flex items-center space-x-2">
                        <button className="standard-button" onClick={handleDownload}>
                            Download PDF
                        </button>
                        <button className="standard-button" onClick={handleOpenInNewWindow}>
                            Open PDF
                        </button>
                        <button className="standard-button" onClick={() => setLoadPdf(true)}>
                            View PDF
                        </button>
                    </div>
                )}
                {isEditModeOn && selectedWorkSubmission.id !== 0 && (
                    <button
                        className="standard-write-button"
                        onClick={() => setOpenUploadModal(true)}
                    >
                        {pdfLocation?.bucketFilename ? "Reupload PDF" : "Upload PDF"}
                    </button>
                )}
            </div>

            {loadPdf && pdfLocation ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <div className="flex items-center justify-center">
                        {zoomPluginInstance.ZoomOut({})}
                        {zoomPluginInstance.CurrentScale({})}
                        {zoomPluginInstance.ZoomIn({})}
                    </div>
                    <div style={{ height: "750px" }}>
                        <Viewer
                            fileUrl={fileActionUrl("open")}
                            plugins={[
                                searchPluginInstance,
                                zoomPluginInstance,
                                getFilePluginInstance,
                            ]}
                        />
                    </div>
                </Worker>
            ) : !loadPdf && pdfLocation ? (
                <div className="h-10 pl-4 pt-2 font-semibold">{pdfLocation?.filename}</div>
            ) : loadPdf && !pdfLocation ? null : (
                <div className="h-40 pl-4 pt-5 flex items-center justify-center text-lg font-semibold">
                    {"No PDF uploaded"}
                </div>
            )}

            {isEditModeOn && openUploadModal && (
                <UploadPDFModal
                    onUpload={handleUploadPDF}
                    work={work}
                    setOpenUploadModal={setOpenUploadModal}
                    refetch={selectedWorkSubmissionRefetch}
                    reupload={!!pdfLocation?.bucketFilename}
                />
            )}
        </div>
    );
};

export default PDFViewer;
