// app/api/rest/upload.ts
import { NextRequest, NextResponse } from 'next/server';
import formidable, { Files, File } from 'formidable';
import fs from 'fs';
import supabase from '@/utils/supabase';
import * as dateFn from "date-fns";
import { join } from 'path';
import { generateFilename } from '@/bucket-management/filenameManagement';


export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const fileBlob = formData.get("file") as Blob | null;
    const fileType = formData.get("datasetType") as string;
    console.log("SDAASD", formData, fileType);

    if (!fileBlob) {
        return NextResponse.json({ error: "File blob is required." }, { status: 400 });
    }

    try {
        // Convert Blob to Buffer for Supabase upload
        const buffer = Buffer.from(await fileBlob.arrayBuffer());

        const bucketFilename = generateFilename(fileBlob.name || "", fileType);

        // // Generate a unique filename
        // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        // const originalFilename = fileBlob.name || '';
        // const extension = originalFilename.split('.').pop();
        // const uniqueFilename = `${originalFilename.replace(/(\.[^/.]+)$/, '')}-${uniqueSuffix}.${extension}`;

        // Upload to Supabase
        const { data, error } = await supabase.storage.from('datasets').upload(bucketFilename, buffer);

        if (error) {
            throw error;
        }

        // Construct the URL to access the file (adjust as per your Supabase setup)
        
        return NextResponse.json({ bucketFilename });
    } catch (e) {
        console.error("Error while trying to upload a file to Supabase\n", e);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}

