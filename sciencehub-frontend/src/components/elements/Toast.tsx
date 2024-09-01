import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ToastAction } from "../ui/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ToasterProps {
    icon: IconDefinition;
    iconClassName?: string;
    title: string;
    subtitle: string;
    className?: string;
}

/**
 * Old Toast, to be replaced
 */
const Toaster: React.FC<ToasterProps> = (props) => {
    const { icon, iconClassName, title, subtitle, className } = props;

    return (
        <div className={`${className || ""}`}>
            <ToastAction
                altText="Work deleted"
                className="flex items-center justify-start m-0 min-w-[28rem] max-w-[100rem] h-10 border-none"
            >
                <div className="flex items-center justify-start max-w-full">
                    <FontAwesomeIcon
                        icon={icon}
                        className={`${iconClassName || ""} w-8 h-8 text-green-600 mr-4`}
                    />
                    <div className="flex flex-col items-start">
                        <div className="font-semibold text-lg text-gray-900 break-words whitespace-nowrap">
                            {title}
                        </div>
                        <div className="text-gray-700 whitespace-nowrap">
                            {subtitle}
                        </div>
                    </div>
                </div>
            </ToastAction>
        </div>
    );
};

export default Toaster;
