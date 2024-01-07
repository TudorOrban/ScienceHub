import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface ResourcesBoxProps {
    label: string;
    icon: IconDefinition;
    content: string;
    link: string;
}

const ResourcesBox: React.FC<ResourcesBoxProps> = ({ label, icon, content, link }) => {
    return (
        <Link href={link} className="min-w-fit bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-md shadow-md hover:shadow-lg">
            <div className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-300 text-xl font-semibold rounded-t-md">
                <FontAwesomeIcon icon={icon} className="text-gray-700 w-4 h-4" />
                <span className="ml-2">{label}</span>
            </div>
            <p className="px-4 py-2">{content}</p>
        </Link>
    )
};

export default ResourcesBox;
