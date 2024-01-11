"use client";

import { UserData } from "@/types/userTypes";
import React, { useContext, useState } from "react";

export type AuthModalContextType = {
    isAuthModalOpen: boolean;
    setIsAuthModalOpen: (isAuthModalOpen: boolean) => void;
};

export const AuthModalContext = React.createContext<AuthModalContextType | undefined>(
    undefined
);

export const useAuthModalContext = (): AuthModalContextType => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error(
            "Please use AuthModalContext within a AuthModalContextProvider"
        );
    }
    return context;
};

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

    return (
        <AuthModalContext.Provider
            value={{
                isAuthModalOpen,
                setIsAuthModalOpen
            }}
        >
            {children}
        </AuthModalContext.Provider>
    );
};
