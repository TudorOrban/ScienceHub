import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { IconDefinition, faQuestion } from "@fortawesome/free-solid-svg-icons";
import React from "react";

type ActionButtonProps = {
    icon: IconDefinition;
    tooltipText: string;
    className?: string;
    tooltipClassName?: string;
};

const ActionButton: React.FC<ActionButtonProps> = (props) => {
    return (
        <div className="bg-white">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="default"
                            className={`bg-white text-gray-800 border border-gray-300 whitespace-nowrap focus:bg-gray-800
                                focus:text-white hover:text-white lg:mt-0 flex-shrink-0 ${
                                    props.className ? props.className : "w-10 h-10"
                                }`}
                        >
                            <FontAwesomeIcon
                                icon={props.icon || faQuestion}
                                className="small-icon"
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        className={`bg-white p-2 ${
                            props.tooltipClassName ? props.tooltipClassName : ""
                        }`}
                    >
                        <p>{props.tooltipText}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default ActionButton;
