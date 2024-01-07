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
import { HandleUploadPDFParams } from "@/submit-handlers/file-uploads/handleUploadPDF";

interface IFormInput {
    file: File;
    // datasetType: string;
}

interface UploadPDFModalProps {
    onUpload: (params: HandleUploadPDFParams) => void;
    work: Work;
    setOpenUploadModal: (openUploadModal: boolean) => void;
    refetch?: () => void;
    reupload?: boolean;
}

const UploadPDFModal: React.FC<UploadPDFModalProps> = ({
    onUpload,
    work,
    setOpenUploadModal,
    refetch,
    reupload,
}) => {
    // Contexts
    // - Edit mode
    const {
        selectedWorkSubmission,
    } = useWorkEditModeContext();

    // - Toasts
    const { setOperations } = useToastsContext();

    const maxFileSize = 50 * 1024 * 1024;

    // Validation schema
    const schema = z
        .object({
            file: z.instanceof(File).refine((file) => file.size <= maxFileSize, {
                message: "File size must be less than 50MB",
            }),
        })

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
            fileType: "pdfs",
            setOpenUploadModal,
            setOperations,
            refetch,
        });
    };

    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute left-4 top-4 sm:left-40 sm:top-40 bg-white border border-gray-200 rounded-md shadow-sm z-50">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between font-semibold text-lg border-b border-gray-300 px-4 py-3">
                        {reupload ? "Reupload Dataset" : "Upload Dataset"}
                        <button
                            className="dialog-close-button"
                            onClick={() => setOpenUploadModal(false)}
                        >
                            <FontAwesomeIcon icon={faXmark} className="small-icon" />
                        </button>
                    </div>
                    <div className="p-4">
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
                                {reupload ? "Reupload PDF" : "Upload PDF"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadPDFModal;
