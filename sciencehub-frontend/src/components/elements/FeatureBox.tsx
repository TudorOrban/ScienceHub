import { Feature } from "@/src/types/infoTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

type FeatureBoxProps = {
    feature: Feature;
    key?: string | number;
    className?: string;
    children?: React.ReactNode;
    useText?: boolean;
};

const FeatureBox: React.FC<FeatureBoxProps> = ({
    feature,
    key,
    className = "",
    useText = true,
}) => {

    return (
        <div
            key={key}
            className={`border-2 border-gray-300 rounded-lg flex flex-shrink-0 text-sm mx-1 my-1 ${className}`}
        >
            <div className={`flex items-center px-2 py-1`}>
                {feature.icon && (
                    <FontAwesomeIcon
                    icon={feature.icon}
                    style={{
                        width: "10px"
                    }}
                    color={feature.iconColor}
                    className="mr-1"
                />
                )}
                {feature.link ? (
                    <Link href={feature.link}>
                        {useText ? (
                            <span className="flex whitespace-nowrap hover:text-blue-700 px-1">
                                {feature.label}
                            </span>
                        ) : null}
                    </Link>
                ) : (
                    <span className="flex whitespace-nowrap px-1">
                        {feature.label}
                    </span>
                )}
            </div>
            <div
                className={`border-l border-gray-400 font-semibold px-2 py-1`}
            >
                {feature.value}
            </div>
        </div>
    );
};

export default FeatureBox;
