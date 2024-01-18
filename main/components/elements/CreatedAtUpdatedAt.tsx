import { formatDate } from "@/utils/functions";

interface CreatedAtUpdatedAtProps {
    createdAt?: string;
    updatedAt?: string;
}

const CreatedAtUpdatedAt: React.FC<CreatedAtUpdatedAtProps> = ({ createdAt, updatedAt }) => {
    return (
        <div className="flex items-center flex-wrap pt-4 pl-1 space-y-2 lg:space-y-0 text-gray-800 font-semibold">
            {createdAt && (
                <div className="flex items-center whitespace-nowrap mr-3">
                    Created at:
                    <div className="pl-1 font-normal text-gray-700">
                        {formatDate(createdAt || "")}
                    </div>
                </div>
            )}
            {updatedAt && (
                <div className="flex items-center whitespace-nowrap">
                    Updated at:
                    <div className="pl-1 font-normal text-gray-700">
                        {formatDate(updatedAt || "")}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatedAtUpdatedAt;
