"use client";

import React, { useContext } from "react";

export type UsersSelectionContextType = {
    selectedUsersIds: string[];
    setSelectedUsersIds: React.Dispatch<React.SetStateAction<string[]>>;
};

/**
 * Context for holding users selection for Create Forms.
 */
export const UsersSelectionContext = React.createContext<UsersSelectionContextType | undefined>(
    undefined
);

export const useUsersSelectionContext = (): UsersSelectionContextType => {
    const context = useContext(UsersSelectionContext);
    if (!context) {
        throw new Error("Please use UsersSelectionContext within an UsersSelectionContextProvider");
    }
    return context;
};

export const UsersSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedUsersIds, setSelectedUsersIds] = React.useState<string[]>([]);

    return (
        <UsersSelectionContext.Provider
            value={{
                selectedUsersIds,
                setSelectedUsersIds,
            }}
        >
            {children}
        </UsersSelectionContext.Provider>
    );
};
