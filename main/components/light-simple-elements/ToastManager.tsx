import {
    OperationOutcome,
    ToastType,
    useToastsContext,
} from "@/contexts/general/ToastsContext";
import Toast from "@/components/light-simple-elements/Toast";
import { useEffect } from "react";

export type OperationType = "create" | "read" | "update" | "delete";

export type Operation = {
    operationType: OperationType;
    operationOutcome: OperationOutcome;
    entityType: string;
    customMessage?: string;
    id?: string | number | undefined | null;
};

interface ToasterManagerProps {
    operations: Operation[];
    mainOperation?: Operation;
}

const ToastManager: React.FC<ToasterManagerProps> = ({ operations, mainOperation }) => {
    const { toasts, setToasts, addToasts, removeToasts } = useToastsContext();

    const operationTitles: Record<OperationOutcome, string> = {
        success: "Success!",
        error: "Error!",
        loading: "Loading",
        undefined: "",
    };

    const operationDefaultDurations: Record<OperationOutcome, number> = {
        success: 6,
        error: 120,
        loading: 3,
        undefined: 3,
    };

    const operationTypePastTense: Record<OperationType, string> = {
        create: "created",
        read: "read",
        update: "updated",
        delete: "deleted",
    };

    const toBeAddedToasts: ToastType[] = operations.map((operation) => {
        const toast: ToastType = {
            outcome: operation.operationOutcome,
            title: operationTitles[operation.operationOutcome],
            subtitle:
                !!operation.customMessage ? operation.customMessage : (operation.operationOutcome === "success"
                    ? `The ${operation.entityType} has been successfully ${operationTypePastTense[operation.operationType]}.`
                    : operation.operationOutcome === "error"
                    ? `An error occured. Please try again later.`
                    : operation.operationOutcome === "loading"
                    ? "Loading..."
                    : ""),
            duration: operationDefaultDurations[operation.operationOutcome],
        };

        return toast;
    });

    // TODO: Add loading toasts
    useEffect(() => {
        addToasts(toBeAddedToasts.filter((toast) => toast.outcome !== "loading"));
    }, [operations]);

    const closeToast = (toastId: number) => {
        removeToasts([toastId]);  
    };

    if (!toasts || toasts.length === 0) return null;

    return (
        <div>
            {toasts.map((toast, index) => (
                <Toast toast={toast} key={toast?.id} index={index} bottomPosition={(index || 0) * 80 + 40} onRemove={() => closeToast(toast.id || -1)}/>
            ))}
        </div>
    );
};

export default ToastManager;