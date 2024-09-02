import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
    isOpen: boolean;
    onChange: (open: boolean) => void;
    title: string;
    description: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onChange,
    title,
    description,
    children,
}) => {
    return (
        <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className="bg-neutral-900/90 backgdrop-blur-sm fixed inset-0 z-40"
                />
                <Dialog.Content
                    className="fixed drop-shadow-md border border-neutral-500 top-[50%] left-[50%] max-h-full h-full
                        md:h-auto md:max-h-[85vh] w-full md:w-[90vw] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md
                        bg-neutral-800 text-gray-100 p-[25px] focus:outline-none z-50"
                >
                    <Dialog.Title
                        className="text-2xl text-center font-bold mb-4"
                    >
                        {title}
                    </Dialog.Title>
                    <Dialog.Description
                        className="mb-5 text-sm leading-normal text-center"
                    >
                        {description}
                    </Dialog.Description>
                    <div>{children}</div>
                    <Dialog.Close asChild>
                        <button
                            className="text-neutral-300 hover:text-white absolute top-[10px] right-[10px] inline-flex h-8 w-8 appearance-none items-center justify-center rounded-full focus:outline-none"
                        >
                            <IoMdClose />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;