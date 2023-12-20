"use client";

import { UserFullDetails } from "@/types/userTypes";
import React, { useContext, useState } from "react";

export type UserDataContextType = {
    userDetails?: UserFullDetails;
    setUserDetails: (userData: UserFullDetails) => void;
    isUser?: boolean;
    identifier?: string;
    editProfileOn?: boolean;
    setEditProfileOn: (userProfileOn: boolean) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    currentTab: string;
    setCurrentTab: (tab: string) => void;
};

export const UserDataContext = React.createContext<
    UserDataContextType | undefined
>(undefined);

export const useUserDataContext = (): UserDataContextType => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error(
            "Please use UserDataContext within a UserDataContextProvider"
        );
    }
    return context;
};

export const UserDataProvider: React.FC<{
    initialUserDetails?: UserFullDetails;
    initialIsUser: boolean;
    initialIdentifier?: string;
    children: React.ReactNode;
}> = ({ initialUserDetails, initialIsUser, initialIdentifier, children }) => {
    const [userDetails, setUserDetails] = useState<UserFullDetails>(
        initialUserDetails || { id: "", username: "", fullName: "" }
    );
    const [isUser, setIsUser] = useState<boolean>(initialIsUser);
    const [identifier, setIdentifier] = useState<string>(
        initialIdentifier || ""
    );
    const [editProfileOn, setEditProfileOn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = useState<string>("");

    return (
        <UserDataContext.Provider
            value={{
                userDetails,
                setUserDetails,
                identifier,
                isUser,
                editProfileOn,
                setEditProfileOn,
                isLoading,
                setIsLoading,
                currentTab,
                setCurrentTab,
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
};