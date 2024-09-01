"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Select from "../light-simple-elements/Select";
import { HandleUploadAIModelParams } from "@/src/services/submit-handlers/file-uploads/handleUploadAIModel";
import { useUpdateGeneralData } from "@/src/hooks/update/useUpdateGeneralData";
import { useWorkEditModeContext } from "@/src/modules/version-control-system/contexts/WorkEditModeContext";
import { AIModel } from "@/src/types/workTypes";
import { Operation, useToastsContext } from "@/src/contexts/general/ToastsContext";

interface IFormInput {
    file: File;
    fileSubtype: string;
}

interface UploadAIModelModalProps {
    onUpload: (params: HandleUploadAIModelParams) => void;
    aiModel: AIModel;
    setOpenUploadModal: (openUploadModal: boolean) => void;
    refetch?: () => void;
    reupload?: boolean;
}

/**
 * Modal for uploading AI model files.
 * Used in AIModelViewer. To be refactored.
 */
const UploadAIModelModal: React.FC<UploadAIModelModalProps> = ({
    onUpload,
    aiModel,
    setOpenUploadModal,
    refetch,
    reupload,
}) => {
    // Contexts
    const { selectedWorkSubmission } = useWorkEditModeContext();
    const { setOperations } = useToastsContext();

    const maxFileSize = 50 * 1024 * 1024;

    // Validation schema
    const schema = z
        .object({
            file: z.instanceof(File).refine((file) => file.size <= maxFileSize, {
                message: "File size must be less than 50MB",
            }),
            fileSubtype: z.string().min(1, "AI Model type is required"),
        })
        .superRefine((data, ctx) => {
            if (!data.file) return;

            let validType = false;
            let errorMessage = "Invalid file type";

            switch (data.fileSubtype) {
                case "pth":
                    validType = data.file.name.endsWith(".pth");
                    errorMessage = "File type must be a PyTorch model (.pth)";
                    break;
                case "onnx":
                    validType = data.file.name.endsWith(".onnx");
                    errorMessage = "File type must be ONNX (.onnx)";
                    break;
                case "pb":
                    validType = data.file.name.endsWith(".pb");
                    errorMessage = "File type must be TensorFlow SavedModel (.pb)";
                    break;
                case "h5":
                    validType = data.file.name.endsWith(".h5");
                    errorMessage = "File type must be HDF5 (.h5)";
                    break;
                case "tflite":
                    validType = data.file.name.endsWith(".tflite");
                    errorMessage = "File type must be TensorFlow Lite Model (.tflite)";
                    break;
                default:
                    validType = false;
                    errorMessage = "Unsupported file subtype";
            }

            if (!validType) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: errorMessage,
                    path: ["file"],
                });
            }
        });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<IFormInput>({
        resolver: zodResolver(schema),
    });

    const fileSubtypeOptions = [
        { label: "pth", value: "pth" },
        { label: "onnx", value: "onnx" },
        { label: "pb", value: "pb" },
        { label: "h5", value: "h5" },
        { label: "tflite", value: "tflite" },
    ];

    const selectedFileSubtype = watch("fileSubtype");

    const updateGeneral = useUpdateGeneralData();

    // Submit handler
    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        onUpload({
            updateGeneral,
            aiModel: aiModel,
            workSubmissionId: selectedWorkSubmission.id,
            file: data.file,
            fileType: "ai_models",
            fileSubtype: data.fileSubtype,
            setOpenUploadModal,
            setOperations,
            refetch,
        });
    };

    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute left-40 top-40 bg-white border border-gray-200 rounded-md shadow-sm z-50">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between font-semibold text-lg border-b border-gray-300 px-4 py-3">
                        {reupload ? "Reupload AIModel" : "Upload AIModel"}
                        <button
                            className="dialog-close-button"
                            onClick={() => setOpenUploadModal(false)}
                        >
                            <FontAwesomeIcon icon={faXmark} className="small-icon" />
                        </button>
                    </div>
                    <div className="p-4 space-y-2">
                        <Controller
                            name="fileSubtype"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    selectOptions={fileSubtypeOptions}
                                    currentSelection={fileSubtypeOptions.find(
                                        (o) => o.value === field.value
                                    )}
                                    setCurrentSelection={(selection) =>
                                        field.onChange(selection.value)
                                    }
                                    defaultValue="Select an AI Model type"
                                    className=""
                                />
                            )}
                        />
                        {errors.fileSubtype && (
                            <p className="text-red-700">{errors.fileSubtype.message}</p>
                        )}

                        <Controller
                            name="file"
                            control={control}
                            defaultValue={undefined}
                            render={({ field: { onChange, value, ref } }) => (
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        onChange(e.target.files ? e.target.files[0] : undefined)
                                    }
                                    ref={ref}
                                />
                            )}
                        />
                        {errors.file && <p className="text-red-700">{errors.file.message}</p>}
                        <div className="flex items-center justify-between">
                            <div className="h-16"></div>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm"
                                style={{ fontWeight: 500 }}
                                type="submit"
                            >
                                {reupload ? "Reupload AI Model" : "Upload AI Model"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadAIModelModal;
