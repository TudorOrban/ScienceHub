// Sidebar.tsx
"use client";

import { browseNavItems } from "@/src/config/navItems.config";
import { useSidebarState } from "@/src/contexts/sidebar-contexts/SidebarContext";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import "@/styles/sidebar.scss";
import CollapsedSidebar from "./CollapsedSidebar";
import SidebarDropdown from "./SidebarDropdown";
import NavItemsUI from "./NavItemsUI";

/**
 * Main Sidebar. Used in root layout.
 */
const Sidebar = () => {
    // Contexts
    const pathname = usePathname();
    const { isSidebarOpen, setSelectedItem, isInBrowseMode, setIsInBrowseMode, setNavItems } =
        useSidebarState();

    // Manage interaction with Browse Sidebar
    useEffect(() => {
        const splittedPath = pathname.split("/");
        if (splittedPath[1] === "browse") {
            setIsInBrowseMode(true);
            setNavItems(browseNavItems);
        } else {
            setIsInBrowseMode(false);
        }
    }, [pathname]);

    // - Item selection
    useEffect(() => {
        if (pathname === "/workspace") {
            setSelectedItem("/workspace");
        }
    }, [pathname]);

    // Ensure that the sidebar is not visible in Browse pages
    if (isInBrowseMode) {
        return null;
    }

    if (!isSidebarOpen) {
        return <CollapsedSidebar />;
    }

    return (
        <aside className="sidebar sidebar--default">
            {/* Shade on small screens */}
            {isSidebarOpen && (
                <div className="fixed inset-0 left-64 top-16 bg-black bg-opacity-50 z-30 md:hidden"></div>
            )}
            {/* Dropdown*/}
            <SidebarDropdown />

            {/* Nav Items */}
            <NavItemsUI />
        </aside>
    );
};

export default Sidebar;
