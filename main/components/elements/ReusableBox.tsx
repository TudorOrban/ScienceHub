interface ReusableBoxProps {
    label: string;
    children: React.ReactNode;
}

const ReusableBox: React.FC<ReusableBoxProps> = ({ label, children }) => {
    return (
        <div className="w-full bg-white border border-gray-300 rounded-md shadow-md overflow-x-auto">
            <div className="px-4 py-2 text-lg whitespace-nowrap border-b border-gray-300" 
                style={{
                    backgroundColor: "var(--page-header-bg-color)",
                    fontWeight: 500
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