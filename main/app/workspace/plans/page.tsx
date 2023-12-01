"use client";

import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
import React, { useState } from "react";

export default function PlansPage() {
    const [viewMode, setViewMode] = useState<"expanded" | "collapsed">(
        "collapsed"
    );
    // const { projectData, error } = useProjectDataAPI(
    //     1,
    //     true
    // );
    // console.log("SDSA", projectData)

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Plans"}
                searchBarPlaceholder="Search plans..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => {}}
                className="border-b border-gray-300"
            />
            <p>Plans</p>
        </div>
    );
}
