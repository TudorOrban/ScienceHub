"use client";

import React, { useState } from "react";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";

const Browse: React.FC = () => {
    const [viewMode, setViewMode] = useState<"expanded" | "collapsed">(
        "collapsed"
    );

    return (
        <div className="mt-20 p-6">
            <BrowseHeaderUI
                title={"Browse"}
                searchBarPlaceholder="Search..."
                className="border-b border-gray-300"
            />
            {/*
            <div className="border-b border-gray-500 mr-4 p-2">
                <span
                    className={`cursor-pointer px-4 py-1 mb-3 ${
                        viewMode === "collapsed"
                            ? "text-gray-900"
                            : "text-gray-400"
                    }`}
                    onClick={() => setViewMode("collapsed")}
                >
                    Collapsed View
                </span>
                <span
                    className={`cursor-pointer px-2 mb-2 ${
                        viewMode === "expanded"
                            ? "text-gray-900"
                            : "text-gray-400"
                    }`}
                    onClick={() => setViewMode("expanded")}
                >
                    Expanded View
                </span>
            </div>
            <SearchResults
                data={data}
                isLoading={isLoading}
                isError={isError}
                viewMode={viewMode}
            /> */}
            {/* Filters section */}
            <div className="my-4">
                <h2 className="text-lg font-semibold mb-2">Filters</h2>
                <button className="bg-blue-200 rounded-lg p-2 mr-2">
                    Last Created
                </button>
                <button className="bg-blue-200 rounded-lg p-2 mr-2">
                    Name
                </button>
            </div>
        </div>
    );
};

export default Browse;
