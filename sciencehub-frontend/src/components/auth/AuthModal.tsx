"use client";

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useAuthModalContext } from "@/src/contexts/current-user/AuthModalContext";

/**
 * Modal establishing authentication through Supabase.
 * Will be replaced with a custom modal in the future.
 */
const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const { isAuthModalOpen, setIsAuthModalOpen } = useAuthModalContext();

    const onClose = () => {
        setIsAuthModalOpen(false);
    }

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
    }, [session, router, onClose]);
    
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <Modal
            title="Welcome back"
            description="Login to your account"
            isOpen={isAuthModalOpen}
            onChange={onChange}
        >
            <Auth 
                magicLink
                providers={["github"]}
                supabaseClient={supabaseClient}
                appearance={{
                    theme: ThemeSupa,
                    style: {
                        input: { background: "white", color: "black" }
                    },
                    className: {
                        container: "pl-6 md:pl-0 text-gray-200",
                        button: "pl-6 md:pl-0 text-gray-100",
                        message: "pl-8 md:pl-0 text-gray-100 text-2xl font-semibold",
                        anchor: "text-gray-200",
                        label: "text-gray-200",
                    },
                }}
                theme="default"
            />
        </Modal>
    );
}

export default AuthModal;