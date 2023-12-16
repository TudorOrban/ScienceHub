// Sidebar.tsx
"use client";

import { browseNavItems } from "@/config/navItems.config";
import { useSidebarState } from "@/contexts/sidebar-contexts/SidebarContext";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import "@/styles/sidebar.scss";
import CollapsedSidebar from "./CollapsedSidebar";

const NavItemsUI = dynamic(
    () => import("@/components/complex-elements/sidebars/NavItemsUI")
);
const SidebarDropdown = dynamic(
    () => import("@/components/complex-elements/sidebars/SidebarDropdown")
);

const Sidebar = () => {
    // Contexts
    const pathname = usePathname();
    const {
        isSidebarOpen,
        setSelectedItem,
        isInBrowseMode,
        setIsInBrowseMode,
        setNavItems,
    } = useSidebarState();

    // Effects
    // - Managing special sidebar for browse
    useEffect(() => {
        const splittedPath = pathname.split("/");
        if (splittedPath[1] === "browse") {
            setIsInBrowseMode(true);
            setNavItems(browseNavItems);
            // setIsDropdownOpen(false);
            // setSelectedBrowsePage(splittedPath[2].charAt(0).toUpperCase() + splittedPath[2].slice(1));
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

    if (isInBrowseMode) {
        return null;
    }

    if (!isSidebarOpen) {
        return <CollapsedSidebar />;
    }

    return (
        <aside className="sidebar sidebar--default">
            {isSidebarOpen && (
                <div className="fixed inset-0 left-64 top-16 bg-black bg-opacity-50 z-30 md:hidden"></div>
            )}
            <SidebarDropdown />
            <NavItemsUI />
        </aside>
    );
    
};

export default Sidebar;

// return (
//     <div
//         className="flex-none overflow-y-auto shadow-md rounded-tr-lg rounded-br-lg"
//         style={{
//             height: "calc(100vh - 4rem)",
//             backgroundColor: "var(--sidebar-bg-color)",
//         }}
//     >
//         <aside className="w-64 bg-gray-100 border-r border-gray-300 scroll-subtle z-10 flex flex-col">
//             <SidebarDropdown />
//             <NavItemsUI />
//         </aside>
//     </div>
// );
