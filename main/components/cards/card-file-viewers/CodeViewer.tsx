import { useEffect, useState } from "react";
import { FileLocation, Work } from "@/types/workTypes";
import { WorkSubmission } from "@/types/versionControlTypes";
import deepEqual from "fast-deep-equal";
import UploadCodeFileModal from "@/components/modals/UploadCodeFileModal";
import { handleUploadCodeFile } from "@/submit-handlers/file-uploads/handleUploadCodeFile";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import { supportedLanguages } from "@/config/supportedFileTypes.config";

interface CodeFileViewerProps {
    work: Work;
    selectedWorkSubmission: WorkSubmission;
    isEditModeOn?: boolean;
    selectedWorkSubmissionRefetch?: () => void;
}

const CodeFileViewer: React.FC<CodeFileViewerProps> = ({
    work,
    selectedWorkSubmission,
    isEditModeOn,
    selectedWorkSubmissionRefetch,
}) => {
    const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
    const [loadCodeFile, setLoadCodeFile] = useState<boolean>(false);
    const [codeLocation, setCodeFileLocation] = useState<FileLocation>();
    const [codeFileContent, setCodeFileContent] = useState<string>();

    // File location changes
    const fileChanges = selectedWorkSubmission?.fileChanges;

    useEffect(() => {
        if (!isEditModeOn && !deepEqual(work.fileLocation, codeLocation)) {
            setCodeFileLocation(work.fileLocation);
        } else if (fileChanges?.fileToBeAdded) {
            setCodeFileLocation(fileChanges.fileToBeAdded);
        } else if (fileChanges?.fileToBeUpdated) {
            setCodeFileLocation(fileChanges.fileToBeUpdated);
        } 
    }, [isEditModeOn, work.fileLocation, fileChanges?.fileToBeAdded, fileChanges?.fileToBeUpdated]);


    const { bucketFilename, fileType } = codeLocation || { bucketFilename: "", fileType: "" };

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

    // Fetch code file content on demand
    useEffect(() => {
        const getFileContent = async () => {
            try {
                const response = await fetch(fileActionUrl("open"));
                const text = await response.text();
                setCodeFileContent(text);
                // Call Prism after state update
                setTimeout(() => Prism.highlightAll(), 0);
            } catch (error) {
                console.error("Failed to fetch file content", error);
            }
        };
    
        if (loadCodeFile) {
            getFileContent();
        }
    }, [loadCodeFile]);

    // Prism synthax highlighting dynamic loading
    const loadPrismLanguage = async (fileSubtype: string) => {
        const language = supportedLanguages.find(lang => lang.value === fileSubtype);
        if (language && language.prismKey) {
            try {
                await import(`prismjs/components/prism-${language.prismKey}.js`);
                Prism.highlightAll();
            } catch (e) {
                console.error("Failed to load Prism language module:", e);
            }
        }
    };

    useEffect(() => {
        if (codeFileContent) {
            Prism.highlightAll();
            loadPrismLanguage(codeLocation?.fileSubtype || "");
        }
    }, [codeFileContent]);
    

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

                {codeLocation?.bucketFilename && (
                    <div className="flex items-center space-x-2">
                        <button className="standard-button" onClick={handleDownload}>
                            Download Code File
                        </button>
                        <button className="standard-button" onClick={handleOpenInNewWindow}>
                            Open Code File
                        </button>
                        <button className="standard-button" onClick={() => setLoadCodeFile(true)}>
                            View Code File
                        </button>
                    </div>
                )}
                {isEditModeOn && selectedWorkSubmission.id !== 0 && (
                    <button
                        className="standard-write-button"
                        onClick={() => setOpenUploadModal(true)}
                    >
                        {codeLocation?.bucketFilename ? "Reupload Code File" : "Upload Code File"}
                    </button>
                )}
            </div>

            {loadCodeFile && codeLocation?.bucketFilename ? (
                <pre>
                    <code className={`language-${supportedLanguages.find(lang => lang.value === codeLocation?.fileSubtype)?.prismKey}`}>
                        {codeFileContent}
                    </code>
                </pre>
            ) : !loadCodeFile && codeLocation?.bucketFilename ? (
                <div className="h-10 pl-4 pt-2 font-semibold">{codeLocation?.filename}</div>
            ) : loadCodeFile && !codeLocation?.bucketFilename ? null : (
                <div className="h-40 pl-4 pt-4 flex items-center justify-center text-lg font-semibold">
                    {"No Code File uploaded"}
                </div>
            )}

            {isEditModeOn && openUploadModal && (
                <UploadCodeFileModal
                    onUpload={handleUploadCodeFile}
                    work={work}
                    setOpenUploadModal={setOpenUploadModal}
                    refetch={selectedWorkSubmissionRefetch}
                    reupload={!!codeLocation?.bucketFilename}
                />
            )}
        </div>
    );
};

export default CodeFileViewer;

// const handleDownload = async (fileLocation: FileLocation) => {
//     try {
//         // Fetch the CODE file
//         const response = await fetch(fileUrl);
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         // Get the Blob from the response and create a Blob URL
//         const fileBlob = await response.blob();
//         const blobUrl = window.URL.createObjectURL(fileBlob);

//         const link = document.createElement("a");
//         link.href = blobUrl;
//         link.download = fileName || "download.code";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         // Clean Blob URL
//         window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//         console.error("Download failed", error);
//     }
// };
