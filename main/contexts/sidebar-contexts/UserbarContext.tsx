"use client";

import { NavItem } from "@/types/infoTypes";
import { createContext, useContext, useState, ReactNode } from "react";

export type UserbarState = {
    isUserbarOpen: boolean;
    navItems: NavItem[];
    setIsUserbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setNavItems(items: NavItem[]): void;
};

const UserbarContext = createContext<UserbarState | null>(null);

export const useUserbarState = (): UserbarState => {
    const context = useContext(UserbarContext);
    if (!context) {
        throw new Error("Please use UserbarProvider in parent component");
    }
    return context;
};

export const UserbarProvider = ({
    children,
    initialNavItems,
}: {
    children: ReactNode;
    initialNavItems: NavItem[];
}) => {
    const [isUserbarOpen, setIsUserbarOpen] = useState<boolean>(false);
    const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems);

    return (
        <UserbarContext.Provider
            value={{ isUserbarOpen, setIsUserbarOpen, navItems, setNavItems }}
        >
            {children}
        </UserbarContext.Provider>
    );
};
