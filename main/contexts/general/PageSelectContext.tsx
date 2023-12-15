"use client";

import React, { useState, useEffect, ReactNode, useContext } from "react";

export type PageSelectContextType = {
    selectedPage: number;
    setSelectedPage: React.Dispatch<React.SetStateAction<number>>;
    setListId: React.Dispatch<React.SetStateAction<string | null>>;
};

export const PageSelectContext = React.createContext<PageSelectContextType | undefined>(
    undefined
);

export const usePageSelectContext = (): PageSelectContextType => {
    const context = useContext(PageSelectContext);
    if (!context) {
        throw new Error("Please use PageSelectContext within an PageSelectContextProvider");
    };
    return context;
}

export const PageSelectProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [selectedPage, setSelectedPage] = useState<number>(1);
    const [listId, setListId] = useState<string | null>(null);

    useEffect(() => {
        setSelectedPage(1);
    }, [listId]);

    return (
        <PageSelectContext.Provider
            value={{
                selectedPage,
                setSelectedPage,
                setListId,
            }}
        >
            {children}
        </PageSelectContext.Provider>
    );
};
