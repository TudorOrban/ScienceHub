export const generateFilename = (originalFilename: string, fileType: string) => {
    // Verify extension coincides with chosen file type
    const extension = "." + fileType;
    const fileExtension = originalFilename.slice(-extension.length);
    if (fileExtension !== extension) {
        throw new Error("File extension is not of the expected type: " + extension + ", " + fileType);
    }
    
    // Generate unique suffix
    const suffixMarker = "!";
    const uniqueSuffix = suffixMarker + Date.now() + Math.round(Math.random() * 1e9) + suffixMarker;

    const result = originalFilename.slice(0, originalFilename.length - extension.length) + uniqueSuffix + fileExtension;

    return result;
}