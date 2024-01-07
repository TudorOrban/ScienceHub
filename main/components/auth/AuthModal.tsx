"use client";

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/auth/useAuthModal";
import { useEffect } from "react";

const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const { onClose, isOpen } = useAuthModal();

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
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth 
                magicLink
                providers={["github"]}
                supabaseClient={supabaseClient}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            
                        },
                    },
                    className: {
                        container: "pl-6 md:pl-0 text-gray-200",
                        button: "pl-6 md:pl-0 text-gray-100",
                        message: "pl-8 md:pl-0 text-gray-100 text-2xl font-semibold",
                        anchor: "text-gray-200",
                        label: "text-gray-200",
                        input: "text-gray-100",
                    },
                }}
                theme="default"
            />
        </Modal>
    );
}

export default AuthModal;