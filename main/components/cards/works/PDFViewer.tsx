// Component that uses react-pdf to display a PDF
import dynamic from "next/dynamic";
const Worker = dynamic(() => import("@react-pdf-viewer/core").then((mod) => mod.Worker));
const Viewer = dynamic(() => import("@react-pdf-viewer/core").then((mod) => mod.Viewer));
// const defaultLayoutPlugin = dynamic(() => import("@react-pdf-viewer/default-layout").then((mod) => mod.defaultLayoutPlugin));
import { searchPlugin } from "@react-pdf-viewer/search";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { getFilePlugin } from "@react-pdf-viewer/get-file";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useState } from "react";
import Link from "next/link";

interface PDFViewerProps {
    fileName?: string;
    fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileName, fileUrl }) => {
    const [loadPdf, setLoadPdf] = useState<boolean>(false);

    const searchPluginInstance = searchPlugin();
    const zoomPluginInstance = zoomPlugin();
    const getFilePluginInstance = getFilePlugin();

    const handleDownload = async () => {
        try {
            // Fetch the PDF file
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Get the Blob from the response and create a Blob URL
            const fileBlob = await response.blob();
            const blobUrl = window.URL.createObjectURL(fileBlob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName || "download.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Clean Blob URL
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    const handleUpload = () => {};

    return (
        <div className="lg:w-[800px] border border-gray-300">
            <div className="flex items-center justify-end p-1 space-x-4 border-b border-gray-300">
                <button
                    className="p-2 bg-white border border-gray-300 rounded-md shadow-sm"
                    onClick={handleUpload}
                >
                    Upload PDF
                </button>
                <button
                    className="p-2 bg-white border border-gray-300 rounded-md shadow-sm"
                    onClick={handleDownload}
                >
                    Download PDF
                </button>
                <Link
                    href={fileUrl}
                    className="p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                >
                    Open PDF
                </Link>
                <button
                    className="p-2 bg-blue-600 text-white border border-gray-300 rounded-md shadow-sm"
                    onClick={() => setLoadPdf(true)}
                >
                    View PDF
                </button>
            </div>
            <div className="flex items-center justify-center">
                {zoomPluginInstance.ZoomOut({})}
                {zoomPluginInstance.CurrentScale({})}
                {zoomPluginInstance.ZoomIn({})}
            </div>
            {loadPdf && !!fileUrl && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <div style={{ height: "750px" }}>
                        <Viewer
                            fileUrl={fileUrl}
                            plugins={[
                                searchPluginInstance,
                                zoomPluginInstance,
                                getFilePluginInstance,
                            ]}
                        />
                    </div>
                </Worker>
            )}
            {loadPdf && !fileUrl && (
                <div className="h-40 flex items-center justify-center text-lg font-semibold">
                    No PDF uploaded
                </div>
            )}
        </div>
    );
};

export default PDFViewer;
