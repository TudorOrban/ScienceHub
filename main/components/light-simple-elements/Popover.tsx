import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect, useRef, useState } from "react";

interface PopoverProps {
    children: ReactNode;
    buttonChildren?: ReactNode;
    button: { label: string; icon?: IconDefinition };
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    className?: string;
}

const Popover: React.FC<PopoverProps> = ({
    children,
    buttonChildren,
    button,
    isOpen,
    setIsOpen,
    className,
}) => {
    const popoverRef = useRef<HTMLDivElement>(null); // Reference to the popover container

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false); // Close the popover if the click is outside
            }
        };

        // Add when the popover is open
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    return (
        <div
            className={`${className} relative inline-flex bg-white text-gray-900 border border-gray-200 text-base`}
            style={{ fontSize: "15px", lineHeight: "20px" }}
            ref={popoverRef}
        >
            {buttonChildren ? (
                buttonChildren
            ) : (
                <button
                    className="flex items-center justify-between px-3 py-2 h-8 font-semibold z-50 rounded-none"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ whiteSpace: "nowrap" }}
                >
                    {button.icon && (
                        <FontAwesomeIcon
                            icon={button.icon}
                            className="small-icon text-gray-700 mr-2"
                        />
                    )}
                    {button.label}
                </button>
            )}
            {isOpen && (
                <div className="absolute left-0 bg-white border border-gray-200 rounded-md shadow-md z-[200] top-full">
                    {children}
                </div>
            )}
        </div>
    );
};

export default Popover;
