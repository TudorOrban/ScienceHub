interface TagProps {
    tag: string;
    className?: string;
}

/**
 * Generic Tag element to be used throughout the app.
 */
const Tag: React.FC<TagProps> = ({ tag, className }) => {
    return (
        <div
            className={`flex items-center justify-center px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-gray-800 text-sm pl-1.5 ${className}`}
            style={{ maxWidth: "80px", fontWeight: 500 }}
        >
            {tag}
        </div>
    );
};

export default Tag;
