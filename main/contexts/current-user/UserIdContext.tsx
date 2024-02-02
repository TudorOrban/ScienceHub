"use client";

import { useUser } from "@supabase/auth-helpers-react";
import React, { createContext, useContext, ReactNode } from "react";

type UserIdContextType = string | null;

/**
 * Context for holding current user's id
 */
const UserIdContext = createContext<UserIdContextType | undefined>(undefined);

export const useUserId = (): UserIdContextType | undefined => {
    const context = useContext(UserIdContext);
    if (!context) {
        // throw new Error("UserContext must be used within a UserProvider");
        // console.log("The userIdContext is not available");
    }
    return context;
};

type UserIdProviderProps = {
    children: ReactNode;
};

export const UserIdProvider: React.FC<UserIdProviderProps> = ({ children }) => {
    const user = useUser();
    const userId = user?.id || null;

    return <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>;
};
