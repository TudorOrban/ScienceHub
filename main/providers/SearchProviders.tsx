import { FallbackSearchProvider } from "@/contexts/search-contexts/FallbackSearchContext";
import { HeaderSearchProvider } from "@/contexts/search-contexts/HeaderSearchContext";
import { ReusableSearchProvider } from "@/contexts/search-contexts/ReusableSearchContext";
import { SidebarSearchProvider } from "@/contexts/search-contexts/SidebarSearchContext";
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
