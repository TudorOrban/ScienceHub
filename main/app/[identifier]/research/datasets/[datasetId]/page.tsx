import React from "react";
import DatasetCard from "@/components/cards/works/DatasetCard";
import { Dataset } from "@/types/workTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { Database } from "@/types_db";
// import { createSupabaseServerComponentClient } from "@/utils/supabaseServerClient";
// import { createServerClient } from "@supabase/ssr";

export const revalidate = 3600;

export default async function DatasetPage({
    params: { identifier, datasetId },
}: {
    params: { identifier: string; datasetId: string };
}) {
    // const cookieStore = cookies();

    // const supabase = createServerClient(
    //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //     {
    //       cookies: {
    //         get(name: string) {
    //           return cookieStore.get(name)?.value
    //         },
    //       },
    //     }
    //   )
    // const user = (await supabase).auth.getUser();
    // console.log("DSADasdAS", (await user).data);


    const datasetData = await fetchGeneralData<Dataset>(supabase, {
        tableName: "datasets",
        categories: ["users", "projects"],
        options: {
            tableRowsIds: [datasetId],
            page: 1,
            itemsPerPage: 10,
            categoriesFetchMode: {
                users: "fields",
                projects: "fields",
            },
            categoriesFields: {
                users: ["id", "username", "full_name"],
                projects: ["id", "name", "title"],
            },
        },
    });

    // const isAuthorized = datasetData.data[0].public || ()

    if (!datasetData.isLoading && datasetData.data.length === 0) {
        notFound();
    }

    return <DatasetCard datasetId={Number(datasetId)} initialData={datasetData} />;
}
