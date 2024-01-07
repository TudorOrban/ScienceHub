interface ReusableBoxProps {
    label: string;
    children: React.ReactNode;
}

const ReusableBox: React.FC<ReusableBoxProps> = ({ label, children }) => {
    return (
        <div className="w-full bg-white border border-gray-300 rounded-md shadow-sm overflow-x-auto">
            <div className="px-4 py-2 text-lg font-semibold whitespace-nowrap border-b border-gray-200" 
                style={{
                    backgroundColor: "var(--page-header-bg-color)",
                }}>
                {label}
            </div>
            <div className="px-4 pb-2">
                {children}
            </div>
        </div>
    );
}

export default ReusableBox;