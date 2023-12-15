// hooks/useTextFieldManager.ts
import { ProjectDelta, TextDiff } from "@/types/versionControlTypes";
import { useState, useCallback, useEffect, useRef } from "react";
import { useContext } from "react";
import {
    CurrentFieldsVersionsContext,
    EditableKeys,
    editableKeysArray,
} from "@/contexts/search-contexts/version-control/CurrentFieldsVersionsContext";

type UseTextFieldManagerProps = {
    initialFields: { [key: string]: string };
    isProjectDataAvailable: boolean;
    isProjectDeltaAvailable: boolean;
};

type UseTextFieldManagerReturn = {
    handleFieldUpdate: (fieldName: string, newText: string) => void;
};

export const useTextFieldManager = ({
    initialFields,
    isProjectDataAvailable,
    isProjectDeltaAvailable,
}: UseTextFieldManagerProps): UseTextFieldManagerReturn => {
    const context = useContext(CurrentFieldsVersionsContext);

    if (!context) {
        throw new Error(
            "CurrentFieldsVersionsContext is undefined, make sure it is provided in component tree"
        );
    }

    const { setField, markFieldAsEdited } = context;
    const initialized = useRef(false);

    useEffect(() => {
        // Check that all required data is available and that the fields have not been initialized yet
        if (
            !initialized.current &&
            isProjectDataAvailable &&
            isProjectDeltaAvailable
        ) {
            // Initialize the context variables here
            Object.keys(initialFields).forEach((key) => {
                setField(key as EditableKeys, initialFields[key]);
                markFieldAsEdited(key as EditableKeys);
            });

            // Set the ref to true so this logic doesn't run again
            initialized.current = true;
        }
    }, [isProjectDataAvailable, isProjectDeltaAvailable, initialFields]);

    const handleFieldUpdate = useCallback(
        (fieldName: string, newText: string) => {
            // Update the field in the context
            setField(fieldName as EditableKeys, newText);
            markFieldAsEdited(fieldName as EditableKeys);
        },
        [initialFields, setField, markFieldAsEdited]
    );

    return {
        handleFieldUpdate,
    };
};
