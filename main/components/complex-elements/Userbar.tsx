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
import { useEffect, useRef } from "react";
import { User } from "@/types/userTypes";
import Image from "next/image";
import dynamic from "next/dynamic";
import Button from "../elements/Button";
const Link = dynamic(() => import("next/link"));

type UserbarProps = {
    setIsUserbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userSmall: User;
};

const Userbar: React.FC<UserbarProps> = ({ setIsUserbarOpen, userSmall }) => {
    const navigationOptions = [
        {
            label: "Profile",
            link: `/${userSmall?.username || ""}/profile`,
            icon: faUser,
        },
        {
            label: "Bookmarks",
            link: `/${userSmall?.username || ""}/bookmarks`,
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
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement | null>(null);

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

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        router.refresh();

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Logged out");
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="userbar shadow-md"
        >
            <Link
                href={`/${userSmall?.username}/profile`}
                className="flex items-center pb-4 px-4 border-b border-gray-200"
            >
                <Image
                    src="/images/blank-avatar-image.png"
                    width={36}
                    height={36}
                    alt="Avatar Image"
                    className={`border border-gray-700 rounded-full`}
                />

                <span className="ml-4 text-black font-semibold hover:text-blue-600 text-lg">
                    {userSmall && <>{userSmall.username}</>}
                </span>
            </Link>

            <div className="flex flex-col space-y-4 px-4 pt-4 z-80">
                {navigationOptions.map((option, index) => (
                    <Link key={index} href={option.link}>
                        <div className="flex items-center  text-gray-700 hover:text-gray-900">
                            <FontAwesomeIcon
                                icon={option.icon}
                                className="small-icon mr-2"
                            />
                            {option.label}
                        </div>
                    </Link>
                ))}
            </div>
            <Button
                onClick={handleLogout}
                className="auth-button ml-4 px-4 mt-6"
            >
                Logout
            </Button>
        </div>
    );
};

export default Userbar;
