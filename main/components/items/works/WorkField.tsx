type WorkFieldProps = {
    title: string;
    content: string | { [key: string]: string };
    className?: string;
    contentClassName?: string;
};

const WorkField: React.FC<WorkFieldProps> = ({ title, content, className, contentClassName }) => {
    return (
        <div className={`border-b border-gray-300 px-4 py-3 ${className}`}>
            <h3 className="font-medium text-lg mb-2">{title}:</h3>
            <div className={`${contentClassName}`}>
                {typeof content === "string" ? (
                    <p>{content}</p>
                ) : (
                    <ul className="list-decimal list-inside text-gray-700">
                        {Object.keys(content).map((key, index) => (
                            <li key={index} className="mb-2">
                                <span className="font-medium">{key}:</span>{" "}
                                {content[key]}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default WorkField;
