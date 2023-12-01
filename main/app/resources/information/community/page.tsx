"use client";

import NavigationMenu from "@/components/headers/NavigationMenu";
import { useState } from "react";

export default function InformationCommunityPage() {
    const [activeTab, setActiveTab] = useState<string>("Discussions");

    return (
        <div>
            <div className="py-8 text-2xl font-semibold flex justify-center">
                Community
            </div>
            <NavigationMenu
                items={[
                    { label: "Discussions" },
                    { label: "Chats" },
                    { label: "Teams" },
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200"
            />
            <div className="p-4 mt-4">
            {activeTab === "Discussions" && (
                <div className="">
                    
                </div>
            )}
            {activeTab === "Chats" && (
                <div className="">
                    
                </div>
            )}
            {activeTab === "Teams" && (
                <div className="">
                    
                </div>
            )}
            </div>
        </div>
    );
}
