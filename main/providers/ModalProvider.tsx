"use client";


import { useEffect, useState } from "react";

import Modal from "@/components/auth/Modal";
import AuthModal from "@/components/auth/AuthModal";
import UploadModal from "@/components/auth/UploadModal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AuthModal />
            <UploadModal />
        </>
    );
}

export default ModalProvider;