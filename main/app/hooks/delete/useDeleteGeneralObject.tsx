import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useDeleteGeneralData } from "./useDeleteGeneralData";
import { useToast } from "@/components/ui/use-toast";
import Toaster from "@/components/elements/Toaster";
import { getObjectNames } from "@/utils/getObjectNames";

export const useDeleteGeneralObject = (tableName: string) => {
    const objectName = getObjectNames({ tableName: tableName})?.label;
    const supabase = useSupabaseClient();

    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    const { toast } = useToast();

    const deleteObject = useDeleteGeneralData();

    const handleDeleteObject = async (objectId: number) => {
        const deletedObject = await deleteObject.mutateAsync({
            supabase,
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
