"use client";

import NavigationMenu from "@/src/components/headers/NavigationMenu";
import { useState } from "react";

export default function InformationMetricsPage() {
    const [activeTab, setActiveTab] = useState<string>("Research Score");

    return (
        <div>
            <div className="py-8 text-2xl font-semibold flex justify-center">
                Metrics
            </div>
            <NavigationMenu
                items={[
                    { label: "Research Score" },
                    { label: "h-Index" },
                    { label: "Citations" },
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200"
            />
            <div className="p-4 mt-4">
            {activeTab === "Research Score" && (
                <div className="">
                    
                </div>
            )}
            {activeTab === "h-Index" && (
                <div className="">
                    
                </div>
            )}
            {activeTab === "Citations" && (
                <div className="">
                    
                </div>
            )}
            </div>
        </div>
    );
}
