"use client";

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/app/hooks/useAuthModal";
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
                    style: {
                        input: { backgroundColor: "rgb(240, 240, 240)"},
                        anchor: { color: "rgb(180, 180, 180)"},
                        label: { color: "rgb(180, 180, 180)"},
                        container: { color: "rgb(180, 180, 180)"},
                        message: { color: "rgb(240, 240, 240)", fontSize: "18px" },
                    }
                }}
                theme="default"
            />
        </Modal>
    );
}

export default AuthModal;