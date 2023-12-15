"use client";

import React from "react";
import useAIModelData from "@/hooks/fetch/data-hooks/works/useAIModelData";
import AIModelCard from "@/components/cards/works/AIModelCard";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { AIModel } from "@/types/workTypes";

export default function AIModelPage({
    params,
}: {
    params: { aiModelId: string };
}) {
    const aiModelData = useAIModelData(params.aiModelId, true);
    const emptyAIModel: AIModel = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <AIModelCard aiModel={aiModelData.data[0] || emptyAIModel} />
            </div>
        </div>
    );
}
