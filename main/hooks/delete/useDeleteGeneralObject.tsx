import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDeleteGeneralData } from "./useDeleteGeneralData";
import { useToast } from "@/components/ui/use-toast";
import Toaster from "@/components/elements/Toast";
import { getObjectNames } from "@/config/getObjectNames";

export const useDeleteGeneralObject = (tableName: string) => {
    const objectName = getObjectNames({ tableName: tableName})?.label;

    const { toast } = useToast();

    const deleteObject = useDeleteGeneralData();

    const handleDeleteObject = async (objectId: number) => {
        const deletedObject = await deleteObject.mutateAsync({
            tableName: tableName,
            id: objectId,
        });

        toast({
            action: (
                <Toaster
                    icon={faCheck}
                    title={"Success!"}
                    subtitle={`The ${objectName} has been deleted`}
                />
            ),
        });
    };

    return { 
        handleDeleteObject
    };
};
