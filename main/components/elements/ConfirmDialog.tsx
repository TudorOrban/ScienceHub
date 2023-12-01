import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface ConfirmDialogProps {
    objectId: number;
    onDelete: (objectId: number) => void;
    objectType: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    objectId,
    onDelete,
    objectType,
}) => {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="bg-white w-8 h-8 border border-gray-300 hover:bg-white"
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            className={`w-4 h-4 text-gray-700 hover:text-red-700`}
                        />
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            {`Are you sure you want to delete
                                                this ${objectType}? This action cannot
                                                be undone.`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center py-2">
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                onClick={() => onDelete(objectId)}
                                className="bg-red-700 text-white hover:bg-red-800 hover:text-white whitespace-nowrap w-1/2 mr-2"
                            >
                                Confirm deletion
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button
                                className="bg-gray-100 text-black hover:bg-gray-500 hover:text-black w-1/2 ml-2"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ConfirmDialog;
