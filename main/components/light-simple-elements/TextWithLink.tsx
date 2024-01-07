import Link from "next/link";

interface TextWithLinkProps {
    text: string;
    link?: string;
    className?: string;
}

export const TextWithLink: React.FC<TextWithLinkProps> = ({ text, link, className }) => {
    if (link) {
        return (
            <Link
                href={link}
                className={`text-blue-600 hover:text-blue-700 hover:underline ${className || ""}`}
            >
                {text}
            </Link>
        );
    } else {
        return <span className={className || ""}>{text}</span>;
    }
};
