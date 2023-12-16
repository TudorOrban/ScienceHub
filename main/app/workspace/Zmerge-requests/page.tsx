"use client";

import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import React from "react";

export default function MergeRequestsPage() {
    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Contributions"}
                searchBarPlaceholder="Search contributions..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => {}}
            />
            <p>Merge requests!</p>
        </div>
    );
}
