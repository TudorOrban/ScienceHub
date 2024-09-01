import { FallbackSearchProvider } from "@/src/contexts/search-contexts/FallbackSearchContext";
import { HeaderSearchProvider } from "@/src/contexts/search-contexts/HeaderSearchContext";
import { ReusableSearchProvider } from "@/src/contexts/search-contexts/ReusableSearchContext";
import { SidebarSearchProvider } from "@/src/contexts/search-contexts/SidebarSearchContext";
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
