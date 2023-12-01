"use client";

import NavigationMenu from "@/components/headers/NavigationMenu";
import { useState } from "react";

export default function MetricsPage() {
    const [activeTab, setActiveTab] = useState<string>("Editor");

    return (
        <div>
            <div className="py-8 text-2xl font-semibold flex justify-center">
                Tools
            </div>
            <NavigationMenu
                items={[
                    { label: "Editor" },
                    { label: "AWS Connection" },
                    { label: "AI Models" },
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200"
            />
            <div className="p-4 mt-4">
            {activeTab === "Editor" && (
                <div className="">
                    
                </div>
            )}
            {activeTab === "AWS Connection" && (
                <div className="">
                    
                </div>
            )}
            {activeTab === "AI Models" && (
                <div className="">
                    
                </div>
            )}
            </div>
        </div>
    );
}
