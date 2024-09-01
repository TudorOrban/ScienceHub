"use client";

import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import { defaultAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import React, { useState } from "react";

export default function ToolsPage() {
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
