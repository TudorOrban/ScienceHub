import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface SwitchProps {
    button: { label?: string, icon?: IconDefinition}
    isOn: boolean;
    toggle: (e: React.MouseEvent) => void;
    className: string;
}

const Switch: React.FC<SwitchProps> = ({ button, isOn, toggle, className }) => {
    return (
        <button
            onClick={(e: React.MouseEvent) => toggle(e)}
            className={`flex items-center bg-white w-8 h-8 border border-gray-300 rounded-md focus:outline-none ${
                isOn ? "bg-gray-300 text-red-400" : ""
            }`}
        >
            {button.icon && <FontAwesomeIcon icon={button.icon} className="small-icon text-gray-700"/>}
            {button.label}
        </button>
    );
};


export default Switch;