import {
    IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ListItem {
    label: string;
    icon?: IconDefinition;
}

interface ListProps {
    items: ListItem[];
    className?: string;
}

const List: React.FC<ListProps> = ({ items, className }) => {
    // useEffect(() => {
    //     let maxOptionWidth = 0;
    //     selectOptions.forEach((option) => {
    //         if (measureRef.current) {
    //             measureRef.current.textContent = option.label || "";
    //             if (measureRef.current.clientWidth > maxOptionWidth) {
    //                 maxOptionWidth = measureRef.current.clientWidth;
    //             }
    //         }
    //     });
    //     setMaxWidth(maxOptionWidth);
    // }, [selectOptions]);

    return (
        <div className={`${className} flex flex-col items-start min-w-max`}>
            {items && items.length > 0 &&
                items.map((item, index) => (
                    <div key={index} className="flex items-center pl-3 pr-6 py-2">
                        {item.icon && (
                            <FontAwesomeIcon icon={item.icon} className="small-icon text-gray-700 mr-2"/>
                        )}
                        {item.label}
                    </div>
                ))}
        </div>
    );
};

export default List;
