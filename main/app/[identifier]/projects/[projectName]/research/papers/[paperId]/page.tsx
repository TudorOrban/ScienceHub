"use client";

import React from "react";
import usePaperData from "@/app/hooks/fetch/data-hooks/works/usePaperData";
import PaperCard from "@/components/cards/works/PaperCard";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { Paper } from "@/types/workTypes";

export default function PaperPage({ params }: { params: { paperId: string } }) {
    const paperData = usePaperData(params.paperId, true);
    const emptyPaper: Paper = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <PaperCard paper={paperData.data[0] || emptyPaper} />
            </div>
        </div>
    );
}
