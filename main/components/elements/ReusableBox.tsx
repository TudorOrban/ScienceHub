import { Skeleton } from "../ui/skeleton";

interface ReusableBoxProps {
    label: string;
    children: React.ReactNode;
    className?: string;
    isLoading?: boolean;
}

/**
 * Generic Box component to be used throughout the app.
 */
const ReusableBox: React.FC<ReusableBoxProps> = ({ label, children, className, isLoading }) => {
    return (
        <div className={`bg-white border border-gray-300 rounded-md shadow-md overflow-x-auto ${className || ""}`}>
            <div className="px-4 py-2 text-lg whitespace-nowrap border-b border-gray-300" 
                style={{
                    backgroundColor: "var(--page-header-bg-color)",
                    fontWeight: 500
                }}>
                {label}
            </div>
            <div className="px-4 py-2">
                {isLoading ? (
                    <Skeleton className="w-full h-20 bg-gray-400"/>
                ) : children}
            </div>
        </div>
    );
}

export default ReusableBox;