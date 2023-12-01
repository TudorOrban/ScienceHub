import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, disabled, type = "button", ...props }, ref) => {
        return (
            <button
                type={type}
                className={twMerge(
                    `
              bg-black text-white
                rounded-full
                disabled:cursor-not-allowed
                disabled:opacity-50
                font-medium
                transition
                z-50
            `,
                    className
                )}
                disabled={disabled}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
