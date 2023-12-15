"use client";

import React, { useContext } from 'react';

export type DeleteModeContextType = {
    isDeleteModeOn: boolean;
    toggleDeleteMode: () => void;
    isConfirmDialogOpen: boolean;
    toggleConfirmDialog: () => void;
};

export const DeleteModeContext = React.createContext<DeleteModeContextType | undefined>(
    undefined
);

export const useDeleteModeContext = (): DeleteModeContextType => {
    const context = useContext(DeleteModeContext);
    if (!context) {
        throw new Error("Please use DeleteModeContext within a DeleteModeContextProvider");
    };
    return context;
}

export const DeleteModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDeleteModeOn, setIsDeleteModeOn] = React.useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

    const toggleDeleteMode = () => {
        setIsDeleteModeOn(!isDeleteModeOn);
    };

    const toggleConfirmDialog = () => {
        setIsConfirmDialogOpen(!isConfirmDialogOpen);
    }

    return (
        <DeleteModeContext.Provider
            value={{
                isDeleteModeOn,
                toggleDeleteMode,
                isConfirmDialogOpen,
                toggleConfirmDialog,
            }}
        >
            {children}
        </DeleteModeContext.Provider>
    );
};
