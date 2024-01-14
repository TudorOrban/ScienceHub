"use client";

import React, { useState } from "react";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";

const Browse: React.FC = () => {
    return (
        <div>
            <BrowseHeaderUI
                title={"Browse"}
                searchBarPlaceholder="Search..."
            />
        </div>
    );
};

export default Browse;
