import supabase from "@/src/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint for downloading files from Supabase storage.
 */
export async function GET(request: NextRequest) {
    // Get necessary metadata
    const filename = request.nextUrl.searchParams.get("filename");
    const fileType = request.nextUrl.searchParams.get("fileType");
    const action = request.nextUrl.searchParams.get("action");

    if (!filename || !fileType || !action) {
        return NextResponse.json({ error: "Filename, FileType and Action required." });
    }

    try {
        // Download from supabase storage
        const { data, error } = await supabase.storage.from(fileType).download(filename);

        if (error || !data) {
            console.error(error?.message || "Could not download file");
            return NextResponse.json(
                { error: error?.message || "File not found" },
                { status: 404 }
            );
        }

        const headers = new Headers();
        headers.append("Content-Type", data?.type || "");
        headers.append("Content-Disposition", action === "download" ? "attachment" : "inline");

        // Create a response from the Blob and get the body as a stream
        const nodeResponse = new Response(data);
        const stream = nodeResponse.body;

        return new NextResponse(stream, { headers });
    } catch (error) {
        console.error("Error while trying to download a file from Supabase\n", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
