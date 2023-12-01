"use client";

import React from "react";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";

const Browse: React.FC = () => {

    return (
        <div className="p-4">
            <BrowseHeaderUI
                title={"Browse"}
                searchBarPlaceholder="Search..."
            />
        </div>
    );
};

export default Browse;
