"use client"

import React, { createContext, useState, useCallback } from "react";

// Context for version control + editing; needs to be updated to the new UnifiedEditor
export const editableKeysArray = ["description", "license"] as const;

export type EditableKeys = typeof editableKeysArray[number];

type CurrentFieldsVersionsContextType = {
    [K in EditableKeys]?: string;
} & {
    [K in `is${Capitalize<string & EditableKeys>}Edited`]: boolean;
} & {
    setField: <K extends EditableKeys>(key: K, value: string) => void;
    markFieldAsEdited: (key: EditableKeys) => void;
};

export const CurrentFieldsVersionsContext = createContext<CurrentFieldsVersionsContextType | undefined>(undefined);

export const CurrentFieldsVersionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fields, setFields] = useState<Record<EditableKeys, string>>({
        // Initialize editable fields
        description: "",
        license: "",
    });

    const [editedFields, setEditedFields] = useState<Record<`is${Capitalize<string & EditableKeys>}Edited`, boolean>>({
        isDescriptionEdited: false,
        isLicenseEdited: false,
    });

    const setField = useCallback(
        <K extends EditableKeys>(key: K, value: string) => {
            setFields((prevFields) => ({
                ...prevFields,
                [key]: value,
            }));
        },
        []
    );

    const markFieldAsEdited = useCallback(
        (key: EditableKeys) => {
            const editedKey = `is${key.charAt(0).toUpperCase() + key.slice(1)}Edited` as keyof typeof editedFields;
            setEditedFields((prevFields) => ({
                ...prevFields,
                [editedKey]: true,
            }));
        },
        []
    );

    return (
        <CurrentFieldsVersionsContext.Provider
            value={{
                ...fields,
                ...editedFields,
                setField,
                markFieldAsEdited,
            }}
        >
            {children}
        </CurrentFieldsVersionsContext.Provider>
    );
};

export default CurrentFieldsVersionsProvider;
