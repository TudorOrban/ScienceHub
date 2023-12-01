"use client";

import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
import React, { useState } from "react";

export default function ToolsPage() {
    const [viewMode, setViewMode] = useState<"expanded" | "collapsed">(
        "collapsed"
    );

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Tools"}
                searchBarPlaceholder="Search tools..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => {}}
                className="border-b border-gray-300"
            />
            <p>Tools!</p>
        </div>
    );
}
