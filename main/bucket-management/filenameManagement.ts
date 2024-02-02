/**
 * Util functions for managing bucket filenames.
 * Will be moved to backend soon.
 */
export const generateFilename = (
    originalFilename: string,
    fileSubtype: string,
    checkSubtype: boolean
) => {
    // Verify extension coincides with chosen file type
    const extension = "." + fileSubtype;
    const fileExtension = originalFilename.slice(-extension.length);
    if (fileExtension !== extension && checkSubtype) {
        throw new Error(
            "File extension is not of the expected type: " + extension + ", " + fileSubtype
        );
    }

    // Generate unique suffix
    const suffixMarker = "!";
    const uniqueSuffix = suffixMarker + Date.now() + Math.round(Math.random() * 1e9) + suffixMarker;

    const result =
        originalFilename.slice(0, originalFilename.length - extension.length) +
        uniqueSuffix +
        fileExtension;

    return result;
};

export const getFileUrl = (fileName: string, fileType: string) => {
    return (
        process.env.NEXT_PUBLIC_SUPABASE_URL! +
        "/storage/v1/object/public/" +
        fileType +
        "/" +
        fileName
    );
};
