import dynamic from "next/dynamic";
const Link = dynamic(() => import("next/link"));

interface TextWithLinkProps {
    text: string;
    link?: string;
}

export const TextWithLink: React.FC<TextWithLinkProps> = ({ text, link }) => {
    if (link) {
        return (
            <Link href={link} className="hover:text-blue-600 hover:underline">
                {text}
            </Link>
        );
    } else {
        return <>{text}</>;
    }
};
