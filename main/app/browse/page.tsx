"use client";

import React from "react";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";

/**
 * Starting point for the Browse page. To be implemented (trending, for you, etc.).
 * 
 */
export default function Browse() {
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
