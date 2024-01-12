import { User } from "@/types/userTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { truncateText } from "@/utils/functions";

interface SmallUserCardProps {
    user: User;
    handleAddSelectedUser?: (user: User) => void;
    handleRemoveSelectedUser?: (userId: string) => void;
    className?: string;
}

const SmallUserCard: React.FC<SmallUserCardProps> = ({
    user,
    handleAddSelectedUser,
    handleRemoveSelectedUser,
    className,
}) => {
    return (
        <div
            className={`flex items-center justify-between w-48 h-12 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 shadow-sm rounded-md ${
                className || ""
            }`}
        >
            <button
                onClick={() => handleAddSelectedUser && handleAddSelectedUser(user)}
                className="flex items-center whitespace-nowrap w-full h-full font-semibold text-sm"
            >
                <FontAwesomeIcon icon={faUser} className="small-icon px-2" />
                {truncateText(user?.fullName, 15)}
            </button>

            {handleRemoveSelectedUser && (
                <button
                    type="button"
                    onClick={() => handleRemoveSelectedUser(user.id)}
                    className="bg-gray-50 text-black pl-2 pr-1"
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="small-icon text-gray-500 hover:text-red-700"
                    />
                </button>
            )}
        </div>
    );
};

export default SmallUserCard;
