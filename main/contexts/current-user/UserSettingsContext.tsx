"use client";

import { HookResult } from "@/hooks/fetch/useGeneralData";
import { UserSettings } from "@/types/userTypes";
import React, { useContext, useState } from "react";

export type UserSettingsContextType = {
    userSettings: HookResult<UserSettings>;
    setUserSettings: (userSettings: HookResult<UserSettings>) => void;
};

/**
 * Context for holding the user settings. Loaded from database in the Header.
 */
export const UserSettingsContext = React.createContext<UserSettingsContextType | undefined>(
    undefined
);

export const useUserSettingsContext = (): UserSettingsContextType => {
    const context = useContext(UserSettingsContext);
    if (!context) {
        throw new Error("Please use UserSettingsContext within a UserSettingsContextProvider");
    }
    return context;
};

export const UserSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userSettings, setUserSettings] = useState<HookResult<UserSettings>>({ data: [] });
    return (
        <UserSettingsContext.Provider
            value={{
                userSettings,
                setUserSettings,
            }}
        >
            {children}
        </UserSettingsContext.Provider>
    );
};
