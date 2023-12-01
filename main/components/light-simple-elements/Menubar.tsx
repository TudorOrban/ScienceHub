import {
    IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useEffect, useState} from "react";
import Popover from "./Popover";

export interface MenubarItem {
    label: string;
    icon?: IconDefinition;
    children?: ReactNode;
}

interface MenubarProps {
    items: MenubarItem[];
    className?: string;
}
const Menubar: React.FC<MenubarProps> = ({ items, className }) => {
    const [openItem, setOpenItem] = useState<string | null>(null);

    return (
        <div className={`${className} flex flex-row items-center rounded-md`}>
            {items &&
                items.map((item, index) => (
                    <div key={index}>
                        
                        <Popover
                            button={{
                                label: item.label,
                                icon: item.icon,
                            }}
                            isOpen={openItem === item.label}
                            setIsOpen={() => {
                                if (openItem === item.label) {
                                    setOpenItem(null); // Close if the same item is clicked
                                } else {
                                    setOpenItem(item.label); // Open the new item
                                }
                            }}
                        >
                            {item.children}
                            </Popover>
                    </div>
                ))}
        </div>
    );
};

export default Menubar;
