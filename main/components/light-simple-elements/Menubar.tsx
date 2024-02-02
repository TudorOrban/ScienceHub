import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Popover = dynamic(() => import("@/components/light-simple-elements/Popover"))
export interface MenubarItem {
    label: string;
    icon?: IconDefinition;
    children?: ReactNode;
}

interface MenubarProps {
    items: MenubarItem[];
    className?: string;
}

/**
 * Light element meant to gradually replace Shadcn UI's.
 */
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
                                    setOpenItem(null);
                                } else {
                                    setOpenItem(item.label);
                                }
                            }}
                            className="px-0.5"
                        >
                            {item.children}
                        </Popover>
                    </div>
                ))}
        </div>
    );
};

export default Menubar;
