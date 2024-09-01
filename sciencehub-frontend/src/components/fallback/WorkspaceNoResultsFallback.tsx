interface WorkspaceNoResultsFallbackProps {
    itemType?: string;
}

const WorkspaceNoResultsFallback: React.FC<WorkspaceNoResultsFallbackProps> = ({ itemType }) => {
    return (
        <div className="w-full h-screen bg-white flex justify-center">
            <div className="font-semibold text-xl text-gray-900 pt-32">
                {`You have not created any ${itemType} yet.`}
            </div>
        </div>
    );
};

export default WorkspaceNoResultsFallback;