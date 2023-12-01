"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

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
    faBoxArchive,
} from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "@/types/infoTypes";
import { useUserSettingsContext } from "../general/UserSettingsContext";

export type PinnedPage = {
    label: string;
    link: string;
    iconIdentifier?: string;
    icon?: IconDefinition;
};

export type SidebarState = {
    isSidebarOpen: boolean;
    navItems: NavItem[];
    selectedItem: string | null;
    areSubItemsVisible: boolean;
    selectedPage: PinnedPage;
    pinnedPages: PinnedPage[];
    iconsMap: { [key: string]: IconDefinition };
    isDropdownOpen: boolean;
    isInBrowseMode: boolean;
    setIsSidebarOpen: (value: boolean) => void;
    setNavItems: (items: NavItem[]) => void;
    setSelectedItem: (item: string | null) => void;
    setSubItemsVisible: (value: boolean) => void;
    setSelectedPage: (page: PinnedPage) => void;
    setPinnedPages: (pages: PinnedPage[]) => void;
    setIsDropdownOpen: (value: boolean) => void;
    setIsInBrowseMode: (value: boolean) => void;
};

export const SidebarContext = createContext<SidebarState | null>(null);

export const useSidebarState = (): SidebarState => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error(
            "Please use SidebarContext within a SidebarContextProvider"
        );
    }
    return context;
};

export const SidebarProvider = ({
    children,
    initialNavItems,
}: {
    children: ReactNode;
    initialNavItems: NavItem[];
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [areSubItemsVisible, setSubItemsVisible] = useState<boolean>(true);
    const [selectedPage, setSelectedPage] = useState<PinnedPage>({
        label: "Home",
        link: "/",
        icon: faGlobe,
    });
    const [pinnedPages, setPinnedPages] = useState<PinnedPage[]>([
        { label: "Home", link: "/", icon: faGlobe },
        { label: "Workspace", link: "/workspace", icon: faBriefcase },
        { label: "Browse", link: "/browse", icon: faSearch },
        { label: "Resources", link: "/resources", icon: faBox },
        { label: "Profile", link: "/profile", icon: faUser },
    ]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isInBrowseMode, setIsInBrowseMode] = useState<boolean>(false);

    // Get pinned pages from user settings
    const { userSettings } = useUserSettingsContext();

    const iconsMap = {
        "Home": faHome,
        "Workspace": faBriefcase,
        "Browse": faSearch,
        "Resources": faBox,
        "Profile": faUser,
        "DynamicRoute": faCodeBranch,
        "default": faQuestion,
    };

    const userPinnedPages = userSettings.data[0]?.pinnedPages;

    useEffect(() => {
        if (userSettings && userPinnedPages && userPinnedPages !== pinnedPages) {
            // TODO: Fix this mess
            const iconsMap: Record<string, IconDefinition> = {
                "faBriefcase": faBriefcase,
                "faGlobe": faGlobe,
                "faSearch": faSearch,
                "faBox": faBox,
                "faUser": faUser,
                "faBoxArchive": faBoxArchive,
            };

            const mappedPages: PinnedPage[] = userPinnedPages.map(
                (page) => {
                    return {
                        label: page.label,
                        link: page.link,
                        icon: iconsMap[page.iconIdentifier || "default"] || faQuestion,
                        iconIdentifier: page.iconIdentifier,
                    };
                }
            );

            setPinnedPages(mappedPages);
        }
    }, [userSettings]);

    

    return (
        <SidebarContext.Provider
            value={{
                isSidebarOpen,
                navItems,
                selectedItem,
                areSubItemsVisible,
                selectedPage,
                pinnedPages,
                isDropdownOpen,
                isInBrowseMode,
                setIsSidebarOpen,
                setNavItems,
                setSubItemsVisible,
                setSelectedPage,
                setSelectedItem,
                setPinnedPages,
                setIsDropdownOpen,
                setIsInBrowseMode,
                iconsMap,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};
