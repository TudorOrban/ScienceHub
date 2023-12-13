// import supabase from "@/utils/supabase";

// export async function uploadAndSplitDataset(file: File) {
//     const chunkSize = 5 * 1024 * 1024;
//     let offset = 0;
//     const metadata = [];

//     while (offset < file.size) {
//         const chunk = file.slice(offset, offset + chunkSize);
//         const chunkName = `${file.name}-chunk-${offset / chunkSize}`;
        
//         const { error: uploadError } = await supabase.storage.from("datasets").upload(chunkName, chunk);
//         if (uploadError) throw uploadError;

//         metadata.push({ chunkName, size: chunk.size });

//         offset += chunkSize;
//     }

//     return metadata;
// }