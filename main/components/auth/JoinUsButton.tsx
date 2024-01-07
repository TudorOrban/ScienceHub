"use client";

import useAuthModal from "@/hooks/auth/useAuthModal";
import Button from "../elements/Button";

const JoinUsButton = () => {
    // Auth
    const authModal = useAuthModal();

    return (
        <Button
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white border border-gray-900 rounded-md shadow-md text-xl font-semibold shadow-outline"
            onClick={authModal.onOpen}
        >
            Join Us
        </Button>
    );
};

export default JoinUsButton;