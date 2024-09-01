"use client";

import NavigationMenu from "@/src/components/headers/NavigationMenu";
import { useState } from "react";

export default function InformationManagementPage() {
    const [activeTab, setActiveTab] = useState<string>("Editor");

    return (
        <div>
            <div className="py-8 text-2xl font-semibold flex justify-center">
                Management
            </div>
            <NavigationMenu
                items={[
                    { label: "Submissions" },
                    { label: "Issues" },
                    { label: "Reviews" },
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200"
            />
            <div className="p-4 mt-4">
            {activeTab === "Submissions" && (
                <div className="">
                    
                </div>
            )}
            {activeTab === "Issues" && (
                <div className="">
                    
                </div>
            )}
            {activeTab === "Reviews" && (
                <div className="">
                    
                </div>
            )}
            </div>
        </div>
    );
}
