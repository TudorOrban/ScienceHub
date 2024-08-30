import toast from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookmark,
    faCircleInfo,
    faGear,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { User } from "@/types/userTypes";
import Link from "next/link";

type UserbarProps = {
    setIsUserbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userSmall: User;
};

/**
 * Userbar, used in the Header.
 */
const Userbar: React.FC<UserbarProps> = ({ setIsUserbarOpen, userSmall }) => {
    // Navigation items
    const navigationOptions = [
        {
            label: "Profile",
            link: `/${userSmall?.username || ""}/profile`,
            icon: faUser,
        },
        {
            label: "Bookmarks",
            link: `/workspace/community/bookmarks`,
            icon: faBookmark,
        },
        {
            label: "Settings",
            link: `/${userSmall?.username || ""}/settings`,
            icon: faGear,
        },
        {
            label: "Help & Support",
            link: `/resources/help-support`,
            icon: faCircleInfo,
        },
    ];

    // Hooks
    const [userInitials, setUserInitials] = useState<string>("");
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                const profileButton = document.querySelector(
                    ".profile-button-class"
                );
                if (
                    profileButton &&
                    profileButton.contains(event.target as Node)
                ) {
                    return;
                }
                setIsUserbarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsUserbarOpen]);

    // Logout
    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        router.refresh();

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Logged out");
        }
    };

    useEffect(() => {
        if (userSmall) {
            // Find capitalized characters in the username, at most 2
            const initials = userSmall.username
                .split("")
                .filter((char) => char === char.toUpperCase())
                .slice(0, 2)
                .join("");
            setUserInitials(initials);
        }
    });

    return (
        <div
            ref={dropdownRef}
            className="userbar shadow-md px-4"
        >
            <Link
                href={`/${userSmall?.username}/profile`}
                className="flex items-center space-x-2"
            >
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-700"
                    style={{ backgroundColor: "var(--sidebar-bg-color)", color: "var(--sidebar-text-color)" }}
                >
                        <p>{userInitials}</p>
                </div>
                <span className="ml-4 text-black font-semibold hover:text-blue-600 text-lg">
                    {userSmall && <>{userSmall.username}</>}
                </span>
            </Link>
            
            <div className="flex flex-col space-y-4 pt-4 z-80">
                {navigationOptions.map((option, index) => (
                    <Link key={index} href={option.link}>
                        <div className="flex items-center text-gray-800 hover:font-semibold hover:text-gray-900">
                            <FontAwesomeIcon
                                icon={option.icon}
                                className="small-icon mr-2"
                            />
                            {option.label}
                        </div>
                    </Link>
                ))}
            </div>
            <button
                onClick={handleLogout}
                className="auth-button mt-6"
            >
                Logout
            </button>
        </div>
    );
};

export default Userbar;
