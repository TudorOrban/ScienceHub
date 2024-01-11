"use client";

import { UserData } from "@/types/userTypes";
import React, { useContext, useState } from "react";

export type UserField = string | string[];
export type UserProfileChanges = Record<string, UserField>;

export type CurrentUserDataContextType = {
    currentUserData: UserData | undefined;
    setCurrentUserData: (userData: UserData) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    currentTab: string;
    setCurrentTab: (tab: string) => void;
};

export const CurrentUserDataContext = React.createContext<CurrentUserDataContextType | undefined>(
    undefined
);

export const useCurrentUserDataContext = (): CurrentUserDataContextType => {
    const context = useContext(CurrentUserDataContext);
    if (!context) {
        throw new Error(
            "Please use CurrentUserDataContext within a CurrentUserDataContextProvider"
        );
    }
    return context;
};

export const CurrentUserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUserData, setCurrentUserData] = useState<UserData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = useState<string>("");

    return (
        <CurrentUserDataContext.Provider
            value={{
                currentUserData,
                setCurrentUserData,
                isLoading,
                setIsLoading,
                currentTab,
                setCurrentTab,
            }}
        >
            {children}
        </CurrentUserDataContext.Provider>
    );
};
