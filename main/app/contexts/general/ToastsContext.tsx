"use client";

import React, { useContext, useState } from 'react';

export type OperationOutcome = "success" | "error" | "loading" | "undefined";

export interface ToastType {
    id?: number;
    outcome: OperationOutcome;
    title?: string;
    subtitle?: string;
    duration?: number;
}

export type ToastsContextType = {
    toasts: ToastType[];
    setToasts: (toasts: ToastType[]) => void;
    addToasts: (toasts: ToastType[]) => void;
    removeToasts: (toastIds: number[]) => void;
};

export const ToastsContext = React.createContext<ToastsContextType | undefined>(
    undefined
);

export const useToastsContext = (): ToastsContextType => {
    const context = useContext(ToastsContext);
    if (!context) {
        throw new Error("Please use ToastsContext within a ToastsContextProvider");
    };
    return context;
}

export const CustomToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const addToasts = (newToasts: ToastType[]) => {
        // Generate new ids for each toast
        const highestId = toasts.reduce((maxId, toast) => Math.max(maxId, toast.id ?? 0), 0);
        const toastsToAdd = newToasts.map((toast, index) => ({
            ...toast,
            id: toast.id ?? highestId + index + 1,
        }));

        setToasts(existingToasts => [...existingToasts, ...toastsToAdd]);

        // Set timeouts to automatically remove each toast after its duration
        toastsToAdd.forEach(toast => {
            if (toast.duration) {
                setTimeout(() => {
                    removeToasts([toast.id]);
                }, toast.duration * 1000);
            }
        });
    };

    const removeToasts = (toastIds: number[]) => {
        setToasts(existingToasts => existingToasts.filter(toast => !toastIds.includes(toast.id || -1)));
    };

    return (
        <ToastsContext.Provider
            value={{
                toasts,
                setToasts,
                addToasts,
                removeToasts,
            }}
        >
            {children}
        </ToastsContext.Provider>
    );
};
