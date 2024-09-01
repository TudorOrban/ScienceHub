// app/api/rest/upload.ts
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/src/utils/supabase";
import { generateFilename } from "@/src/utils/bucket-management/filenameManagement";

/*
* Endpoint for uploading files to Supabase storage.
* It will soon be moved to the .NET backend for proper validation, sanitization etc.

* File type can be PDF, dataset etc., while fileSubtype can be .xlsx, .csv etc.

* Used on works' pages
*/
export async function POST(request: NextRequest) {
    // Get form data
    const formData = await request.formData();
    const fileBlob = formData.get("file") as Blob | null;
    const fileSubtype = formData.get("fileSubtype") as string;

    // Get necessary metadata
    const fileType = request.headers.get("X-FileType");
    const checkSubtypeString = request.headers.get("X-checkFileSubtype");
    const checkSubtype = checkSubtypeString === "true";

    if (!fileType) return;

    console.log("Received data: ", formData, fileType, fileSubtype);

    if (!fileBlob) {
        return NextResponse.json({ error: "File blob is required." }, { status: 400 });
    }

    try {
        // Convert Blob to Buffer for Supabase upload
        const buffer = Buffer.from(await fileBlob.arrayBuffer());

        // Construct unique bucket filename
        const bucketFilename = generateFilename(fileBlob.name || "", fileSubtype, checkSubtype);

        // Upload to Supabase bucket
        const { data, error } = await supabase.storage
            .from(fileType)
            .upload(bucketFilename, buffer);

        if (error) {
            throw error;
        }

        return NextResponse.json({ bucketFilename });
    } catch (e) {
        console.error("Error while trying to upload a file to Supabase\n", e);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
