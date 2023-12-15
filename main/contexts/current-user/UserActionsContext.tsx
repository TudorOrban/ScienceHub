"use client";

import { HookResult } from "@/hooks/fetch/useGeneralData";
import { UserCommunityActionsSmall } from "@/types/communityTypes";
import React, { useContext, useState } from "react";

export type UserActionsContextType = {
    userActions: HookResult<UserCommunityActionsSmall>;
    setUserActions: (
        userActions: HookResult<UserCommunityActionsSmall>
    ) => void;
};

export const UserActionsContext = React.createContext<
    UserActionsContextType | undefined
>(undefined);

export const useUserActionsContext = (): UserActionsContextType => {
    const context = useContext(UserActionsContext);
    if (!context) {
        throw new Error(
            "Please use UserActionsContext within a UserActionsContextProvider"
        );
    }
    return context;
};

export const UserActionsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [userActions, setUserActions] = useState<
        HookResult<UserCommunityActionsSmall>
    >({ data: [] });

    return (
        <UserActionsContext.Provider
            value={{
                userActions,
                setUserActions,
            }}
        >
            {children}
        </UserActionsContext.Provider>
    );
};
