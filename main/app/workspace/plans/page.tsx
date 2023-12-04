"use client";

import { useUserId } from "@/app/contexts/current-user/UserIdContext";
import { usePlansSearch } from "@/app/hooks/fetch/search-hooks/usePlans";
import Calendar from "@/components/complex-elements/Calendar";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
import React, { useState } from "react";

export default function PlansPage() {
    const currentUserId = useUserId();

    const userPlansData = usePlansSearch({
        extraFilters: {
            users: currentUserId,
        },
        enabled: !!currentUserId,
        context: "Workspace General",
        page: 1,
        itemsPerPage: 100,
        includeRefetch: true,
    });

    return (
        <div>
            {/* <ListHeaderUI
                breadcrumb={true}
                title={"Plans"}
                searchBarPlaceholder="Search plans..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => {}}
                className="border-b border-gray-300"
            /> */}
            <div className="p-4">
                <Calendar plansData={userPlansData} />
            </div>
        </div>
    );
}
