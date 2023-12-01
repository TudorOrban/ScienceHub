import { FallbackSearchProvider } from "@/app/contexts/search-contexts/FallbackSearchContext";
import { HeaderSearchProvider } from "@/app/contexts/search-contexts/HeaderSearchContext";
import { ReusableSearchProvider } from "@/app/contexts/search-contexts/ReusableSearchContext";
import { SidebarSearchProvider } from "@/app/contexts/search-contexts/SidebarSearchContext";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <FallbackSearchProvider>
            <ReusableSearchProvider>
                <HeaderSearchProvider>
                    <SidebarSearchProvider>{children}</SidebarSearchProvider>
                </HeaderSearchProvider>
            </ReusableSearchProvider>
        </FallbackSearchProvider>
    );
}
