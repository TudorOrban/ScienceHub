import { IconDefinition, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ListItem {
    label: string;
    icon?: IconDefinition;
    onClick?: () => void;
    children?: ReactNode;
}

interface ListProps {
    items: ListItem[];
    className?: string;
}

/**
 * Light element meant to gradually replace Shadcn UI's.
 */
const List: React.FC<ListProps> = ({ items, className }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = (event: React.MouseEvent) => {
        // Check if relatedTarget is a Node and if the mouse is still over the list or its children
        if (
            event.relatedTarget instanceof Node &&
            listRef.current &&
            !listRef.current.contains(event.relatedTarget)
        ) {
            setHoveredIndex(null);
        }
    };

    return (
        <div
            ref={listRef}
            className={`flex flex-col items-start bg-white border border-gray-200 rounded-md shadow-md ${className}`}
        >
            {items &&
                items.length > 0 &&
                items.map((item, index) => (
                    <div
                        key={index}
                        className="group flex flex-col pl-3 pr-6 py-2 hover:bg-gray-100 w-full relative"
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className="flex items-center relative"
                            onClick={item.onClick || (() => {})}
                        >
                            {item.icon && (
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className="small-icon text-gray-700 mr-2"
                                />
                            )}
                            {item.label}
                            {item.children && (
                                <FontAwesomeIcon
                                    icon={faCaretRight}
                                    className="small-icon text-gray-700 ml-2"
                                />
                            )}
                        </div>
                        {index === hoveredIndex && item.children && (
                            <div
                                className="absolute left-full top-0 bg-white border border-gray-200 rounded-md shadow-md"
                                onMouseEnter={() => handleMouseEnter(index)}
                            >
                                {item.children}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
};

export default List;
