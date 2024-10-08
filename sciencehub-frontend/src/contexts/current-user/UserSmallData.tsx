"use client";

import { HookResult } from "@/src/hooks/fetch/useGeneralData";
import { User } from "@/src/types/userTypes";
import React, { useContext, useState } from "react";

export type UserSmallDataContextType = {
    userSmall: HookResult<User>;
    setUserSmall: (userSmall: HookResult<User>) => void;
};

/**
 * Context for holding current user's small data
 */
export const UserSmallDataContext = React.createContext<UserSmallDataContextType | undefined>(
    undefined
);

export const useUserSmallDataContext = (): UserSmallDataContextType => {
    const context = useContext(UserSmallDataContext);
    if (!context) {
        throw new Error("Please use UserSmallDataContext within a UserSmallDataContextProvider");
    }
    return context;
};

export const UserSmallDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userSmall, setUserSmall] = useState<HookResult<User>>({ data: [] });
    return (
        <UserSmallDataContext.Provider
            value={{
                userSmall,
                setUserSmall,
            }}
        >
            {children}
        </UserSmallDataContext.Provider>
    );
};
