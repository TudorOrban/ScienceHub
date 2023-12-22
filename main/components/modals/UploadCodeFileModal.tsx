"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Select from "../light-simple-elements/Select";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useWorkEditModeContext } from "@/version-control-system/contexts/WorkEditModeContext";
import { Paper, Work } from "@/types/workTypes";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { HandleUploadCodeFileParams } from "@/submit-handlers/file-uploads/handleUploadCodeFile";
import { supportedLanguages } from "@/config/supportedFileTypes.config";

interface IFormInput {
    file: File;
    fileSubtype: string;
}

interface UploadCodeFileModalProps {
    onUpload: (params: HandleUploadCodeFileParams) => void;
    work: Work;
    setOpenUploadModal: (openUploadModal: boolean) => void;
    refetch?: () => void;
    reupload?: boolean;
}

const UploadCodeFileModal: React.FC<UploadCodeFileModalProps> = ({
    onUpload,
    work,
    setOpenUploadModal,
    refetch,
    reupload,
}) => {
    // Contexts
    // - Edit mode
    const { selectedWorkSubmission } = useWorkEditModeContext();

    // - Toasts
    const { setOperations } = useToastsContext();

    const maxFileSize = 50 * 1024 * 1024;

    // Validation schema
    const schema = z
        .object({
            file: z.instanceof(File).refine((file) => file.size <= maxFileSize, {
                message: "File size must be less than 50MB",
            }),
            fileSubtype: z.string().min(1, "Code file type is required"),
        })
        .superRefine((data, ctx) => {
            if (!data.file) return;

            const validType = data.file.name.endsWith("." + data.fileSubtype);
            const errorMessage = `File must be a ${supportedLanguages.find((lang) => lang.value === data.fileSubtype)?.label} file`;

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

    const updateGeneral = useUpdateGeneralData();

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        onUpload({
            updateGeneral,
            work: work,
            workSubmissionId: selectedWorkSubmission.id,
            file: data.file,
            fileType: "code_files",
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
                        {reupload ? "Reupload Code File" : "Upload Code File"}
                        <button
                            className="dialog-close-button"
                            onClick={() => setOpenUploadModal(false)}
                            type="button"
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
                                    selectOptions={supportedLanguages}
                                    currentSelection={supportedLanguages.find(
                                        (o) => o.value === field.value
                                    )}
                                    setCurrentSelection={(selection) =>
                                        field.onChange(selection.value)
                                    }
                                    defaultValue="Select a code file type"
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
                                {reupload ? "Reupload Code File" : "Upload Code File"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadCodeFileModal;
