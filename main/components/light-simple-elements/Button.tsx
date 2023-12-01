import React, { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick: (event: MouseEvent) => void;
    className: string;
};

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    className,
}) => {
    return (
        <button className={`${className} w-8 h-8 bg-white text-gray-900 border border-gray-200`} onClick={() => onClick}>
            
        </button>
    )
};