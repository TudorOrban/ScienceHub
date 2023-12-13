import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Toaster from "../../elements/Toaster";

export type OperationType = "create" | "read" | "update" | "delete";

export type Operation = {
    operationType: OperationType;
    entityType: string;
    id: string | number | undefined | null;
};

interface ToasterManagerProps {
    operations: Operation[];
    mainOperation: Operation;
    customSuccessMessage?: string;
}

const ToasterManager: React.FC<ToasterManagerProps> = ({
    operations,
    mainOperation,
    customSuccessMessage
}) => {
    // Find the missing IDs
    const ids = operations.map((operation) => operation.id);
    const missingIds = ids.filter((id) => id === null || id === undefined || Number.isNaN(id));

    // Select an appropriate icon based on the status
    const icon = missingIds.length === 0 ? faCheck : faTimes;

    // Generate a subtitle based on the type of operation and the entity
    let entityTitles: string[] = [];
    let entitySubtitles: string[] = [];

    if (missingIds.length === 0) {
        const operationLabel = getOperationLabel(mainOperation.operationType);

        entitySubtitles.push(
            `${mainOperation.entityType} has been successfully ${operationLabel}.`
        );
    } else {
        for (const operation of operations) {
            // subtitles += ``;
            if (missingIds.includes(operation.id)) {
                entityTitles.push("Error");
                entitySubtitles.push(
                    `Failed to ${operation.operationType} ${operation.entityType}!`
                );
            }
        }
    }

    // Generate a title based on the status
    const title = missingIds.length === 0 ? (!!customSuccessMessage ? customSuccessMessage : "Success!") : "Failure";

    if (icon === faCheck) {
        return (
            <div>
                <Toaster
                    icon={icon}
                    title={title}
                    subtitle={entitySubtitles[0]}
                />
            </div>
        );
    } else {
        return (
            <div>
                {operations
                    .filter((operation) => missingIds.includes(operation.id))
                    .map((operation, index) => (
                        <div key={index} className="p-4">
                            <Toaster
                                icon={faTimes}
                                iconClassName="text-red-600"
                                title={entityTitles[index]}
                                subtitle={entitySubtitles[index]}
                            />
                        </div>
                    ))}
            </div>
        );
    }
};

const getOperationLabel = (operationType: OperationType) => {
    switch (operationType) {
        case "create":
            return "created";
            break;
        case "read":
            return "read";
            break;
        case "update":
            return "updated";
            break;
        case "delete":
            return "deleted";
            break;
    }
};

export default ToasterManager;
