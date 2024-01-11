"use client";

import { useAuthModalContext } from "@/contexts/current-user/AuthModalContext";
import Button from "../elements/Button";

const JoinUsButton = () => {
    // - Auth modal
    const { isAuthModalOpen, setIsAuthModalOpen } = useAuthModalContext();

    return (
        <Button
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white border border-gray-900 rounded-md shadow-md text-xl font-semibold shadow-outline"
            onClick={() => setIsAuthModalOpen(!isAuthModalOpen)}
        >
            Join Us
        </Button>
    );
};

export default JoinUsButton;