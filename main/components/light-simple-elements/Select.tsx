import { IconDefinition, faCaretDown, faCaretUp, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect, useRef, useState } from "react";

export interface SelectOption {
    label?: string;
    value?: string | number;
    icon?: IconDefinition;
    extraInfo?: any;
}

interface SelectProps {
    selectOptions: SelectOption[];
    currentSelection: SelectOption | undefined;
    setCurrentSelection: (selection: SelectOption) => void;
    defaultValue?: string;
    label?: string;
    className?: string;
    listElementClassName?: string;
}

const Select: React.FC<SelectProps> = ({
    selectOptions,
    currentSelection,
    setCurrentSelection,
    defaultValue,
    label,
    className,
    listElementClassName,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close the dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        // Bind the event listener
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Close the dropdown when an option is selected
    const handleSelect = (option: SelectOption) => {
        setCurrentSelection(option);
        setIsOpen(false); // Close the dropdown
    };

    return (
        <div
            className={`relative bg-white text-gray-900 border border-gray-200 text-base rounded-md ${className}`}
            style={{ fontSize: "15px", lineHeight: "20px" }}
            ref={wrapperRef} // Set the ref for the wrapper
        >
            <button
                className="flex items-center justify-between w-full px-2 py-1 h-8"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-gray-900 whitespace-nowrap" style={{ fontWeight: 500 }}>
                    {currentSelection?.label || defaultValue}
                </div>
                <FontAwesomeIcon
                    icon={isOpen ? faCaretUp : faCaretDown}
                    className="small-icon text-gray-700 mr-2"
                />
            </button>
            {isOpen && (
                <div className="absolute left-0 top-10 w-auto min-w-full bg-white border border-gray-200 rounded-md shadow-md">
                    {label && (
                        <div className="font-semibold flex whitespace-nowrap px-2 py-1">
                            {label}
                        </div>
                    )}
                    {selectOptions.map((option, index) => (
                        <button
                            className={`flex items-center justify-between px-2 py-1 h-8 w-auto min-w-full ${
                                option.value === currentSelection?.value ? "bg-gray-200" : ""
                            }`}
                            key={index}
                            onClick={() => handleSelect(option)}
                        >
                            <span className="flex whitespace-nowrap" style={{ fontWeight: 500 }}>
                                {option.label}
                            </span>
                            {option.value === currentSelection?.value && (
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className="small-icon text-gray-700 ml-4 mr-1"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
