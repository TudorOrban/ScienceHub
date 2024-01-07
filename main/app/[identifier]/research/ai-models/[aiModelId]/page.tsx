import AIModelCard from "@/components/cards/works/AIModelCard";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import { AIModel } from "@/types/workTypes";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export default async function AIModelPage({
    params: { aiModelId },
}: {
    params: { aiModelId: string };
}) {
    const aiModelData = await fetchGeneralData<AIModel>(supabase, {
        tableName: "ai_models",
        categories: ["users", "projects"],
        options: {
            tableRowsIds: [aiModelId],
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

    if (!aiModelData.isLoading && aiModelData.data.length === 0) {
        notFound();
    }
    
    return <AIModelCard aiModelId={Number(aiModelId)} initialData={aiModelData} />;

}
