import { DeltaData } from "@/types/versionControlTypes";

function deepCompare(
    versionFrom: any,
    versionTo: any,
    path: string = ""
): DeltaData {
    let delta: DeltaData = {};

    // Handle null and undefined cases
    if (
        versionFrom === null ||
        versionTo === null ||
        typeof versionFrom === "undefined" ||
        typeof versionTo === "undefined"
    ) {
        if (versionFrom !== versionTo) {
            delta[path] = {
                action: versionTo ? "added" : "removed",
                value: versionTo || versionFrom,
            };
        }
        return delta;
    }

    // Handle primitive types (number, string, boolean)
    if (typeof versionFrom !== "object" || typeof versionTo !== "object") {
        if (versionFrom !== versionTo) {
            delta[path] = { action: "modified", value: versionTo };
        }
        return delta;
    }

    // Handle arrays
    if (Array.isArray(versionFrom) && Array.isArray(versionTo)) {
        if (versionFrom.length !== versionTo.length) {
            delta[path] = { action: "modified", value: versionTo };
        } else {
            versionFrom.forEach((item, index) => {
                const itemDelta = deepCompare(
                    item,
                    versionTo[index],
                    `${path}[${index}]`
                );
                if (Object.keys(itemDelta).length > 0) {
                    delta = { ...delta, ...itemDelta };
                }
            });
        }
        return delta;
    }

    // Handle objects
    const keys = new Set([
        ...Object.keys(versionFrom),
        ...Object.keys(versionTo),
    ]);
    keys.forEach((key) => {
        const keyPath = path ? `${path}.${key}` : key;
        const keyDelta = deepCompare(versionFrom[key], versionTo[key], keyPath);
        if (Object.keys(keyDelta).length > 0) {
            delta = { ...delta, ...keyDelta };
        }
    });

    return delta;
}

export default deepCompare;