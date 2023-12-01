"use client";

import React from "react";
import useCodeBlockData from "@/app/hooks/fetch/data-hooks/works/useCodeBlockData";
import CodeBlockCard from "@/components/cards/works/CodeBlockCard";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { CodeBlock } from "@/types/workTypes";

export default function CodeBlockPage({
    params,
}: {
    params: { codeBlockId: string };
}) {
    const codeBlockData = useCodeBlockData(params.codeBlockId, true);
    const emptyCodeBlock: CodeBlock = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <CodeBlockCard codeBlock={codeBlockData.data[0] || emptyCodeBlock} />
            </div>
        </div>
    );
}
