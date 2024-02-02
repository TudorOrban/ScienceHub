import { upperCaseFirstLetter } from "@/utils/functions";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Breadcrumb component. Will most likely be removed.
 */
export default function Breadcrumb() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter((segment) => segment);

    const generateUrlToSegment = (index: number) =>
        "/" + pathSegments.slice(0, index + 1).join("/");

    return (
        <div className="flex items-center">
            {pathSegments.map((segment, index) => (
                <span key={index} className="flex items-center text-gray-600 hover:text-blue-600">
                    {index > 0 && (
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            className="w-3 h-3 px-0.5 text-gray-500"
                        />
                    )}
                    <Link href={generateUrlToSegment(index)}>
                        <div
                            className={`whitespace-nowrap text-ellipsis overflow-hidden ${
                                index > 0 ? "p-1" : "pr-1"
                            }`}
                            style={{ maxWidth: "240px" }}
                        >
                            {upperCaseFirstLetter(segment)}
                        </div>
                    </Link>
                </span>
            ))}
        </div>
    );
}
