"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import {
    IconDefinition,
    faBriefcase,
    faHome,
    faSearch,
    faBox,
    faUser,
    faQuestion,
    faCodeBranch,
    faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { DirectoryItem, ProjectLayout } from "@/src/types/projectTypes";
import { PinnedPage } from "@/src/contexts/sidebar-contexts/SidebarContext";

export type EditorSidebarState = {
    isEditorSidebarOpen: boolean;
    directoryItems: DirectoryItem[];
    selectedItem: string | null;
    areSubItemsVisible: boolean;
    selectedPage: PinnedPage;
    pinnedPages: PinnedPage[];
    iconsMap: { [key: string]: IconDefinition };
    isDropdownOpen: boolean;
    setIsEditorSidebarOpen: (value: boolean) => void;
    setDirectoryItems: (items: DirectoryItem[]) => void;
    setSelectedItem: (item: string | null) => void;
    setSubItemsVisible: (value: boolean) => void;
    setSelectedPage: (page: PinnedPage) => void;
    setPinnedPages: (pages: PinnedPage[]) => void;
    setIsDropdownOpen: (value: boolean) => void;
};

export const EditorSidebarContext = createContext<EditorSidebarState | null>(null);

export const useEditorSidebarState = (): EditorSidebarState => {
    const context = useContext(EditorSidebarContext);
    if (!context) {
        throw new Error("Please use EditorSidebarProvider in parent component");
    }
    return context;
};

export const EditorSidebarProvider = ({
    children,
    initialDirectoryItems,
}: {
    children: ReactNode;
    initialDirectoryItems: DirectoryItem[];
}) => {
    const [isEditorSidebarOpen, setIsEditorSidebarOpen] = useState<boolean>(true);
    const [directoryItems, setDirectoryItems] = useState<DirectoryItem[]>(initialDirectoryItems);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [areSubItemsVisible, setSubItemsVisible] = useState<boolean>(true);
    const [selectedPage, setSelectedPage] = useState<PinnedPage>({
        label: "Home",
        link: "/",
        iconIdentifier: "faGlobe",
    });
    const [pinnedPages, setPinnedPages] = useState<PinnedPage[]>([
        { label: "Home", link: "/", iconIdentifier: "faGlobe" },
        { label: "Workspace", link: "/workspace", iconIdentifier: "faBriefcase" },
        { label: "Browse", link: "/browse", iconIdentifier: "faSearch" },
        { label: "Resources", link: "/resources", iconIdentifier: "faBox" },
        { label: "Profile", link: "/profile", iconIdentifier: "faUser" },
    ]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isInBrowseMode, setIsInBrowseMode] = useState<boolean>(false);

    const iconsMap = {
        Home: faHome,
        Workspace: faBriefcase,
        Browse: faSearch,
        Resources: faBox,
        Profile: faUser,
        DynamicRoute: faCodeBranch,
        default: faQuestion,
    };

    return (
        <EditorSidebarContext.Provider
            value={{
                isEditorSidebarOpen,
                directoryItems,
                selectedItem,
                areSubItemsVisible,
                selectedPage,
                pinnedPages,
                isDropdownOpen,
                setIsEditorSidebarOpen,
                setDirectoryItems,
                setSubItemsVisible,
                setSelectedPage,
                setSelectedItem,
                setPinnedPages,
                setIsDropdownOpen,
                iconsMap,
            }}
        >
            {children}
        </EditorSidebarContext.Provider>
    );
};
