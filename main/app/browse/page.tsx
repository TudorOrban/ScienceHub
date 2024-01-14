"use client";

import React from "react";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";

const Browse: React.FC = () => {

    return (
        <div>
            <BrowseHeaderUI
                title={"Browse"}
                searchBarPlaceholder="Search..."
                className="border-b border-gray-300"
            />
        </div>
    );
};

export default Browse;
