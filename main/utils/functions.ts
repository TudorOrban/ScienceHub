import useIdentifier from "@/app/hooks/utils/useIdentifier";
import { SnakeCaseObject } from "@/services/fetch/fetchGeneralDataAdvanced";

// Time formatting
// - Supabase to ISO (new Date()) and back
export function toSupabaseDateFormat(isoDate: string) {
    return isoDate.replace("T", " ").replace(/\.\d{3}Z$/, "+00");
}

export function toISOFormat(supabaseDate: string) {
    return supabaseDate.replace(" ", "T").replace(/\+00$/, ".000Z");
}

export function formatSupabaseDate(
    supabaseDate: string,
    includeYear: boolean = true,
    includeMonth: boolean = true,
    includeHour: boolean = true,
    includeTime: boolean = false
) {
    const date = new Date(toISOFormat(supabaseDate));
    
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    let dateString = "";

    if (includeYear) dateString += `${year}`;
    if (includeMonth) dateString += `, ${month} `;
    dateString += `${day}`;
    if (includeHour) dateString += `, ${hour}`;
    if (includeTime) dateString += `:${minutes}:${seconds}`;

    return dateString.trim();
}


export const formatDateForTimestamptz = (date: Date): string => {
    const YYYY = date.getUTCFullYear();
    const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
    const DD = String(date.getUTCDate()).padStart(2, "0");
    const HH = String(date.getUTCHours()).padStart(2, "0");
    const MI = String(date.getUTCMinutes()).padStart(2, "0");
    const SS = String(date.getUTCSeconds()).padStart(2, "0");

    return `${YYYY}-${MM}-${DD} ${HH}:${MI}:${SS}+00`;
};

type DateFormatOptions = Partial<{
    year: "numeric" | "2-digit";
    month: "numeric" | "2-digit" | "long" | "short" | "narrow";
    day: "numeric" | "2-digit";
    hour: "numeric" | "2-digit";
    minute: "numeric" | "2-digit";
    second: "numeric" | "2-digit";
    timeZoneName: "short" | "long";
}>;

export const formatDate = (
    timestamp: string,
    options: DateFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    }
): string => {
    if (!timestamp) {
        return "No date";
    }
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", options);
};

export const calculateDaysAgo = (dateString: string): number => {
    const date = new Date(dateString);
    const now = new Date();

    const timeDifference = Math.abs(now.getTime() - date.getTime());

    const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));

    return daysAgo;
};

export const formatDaysAgo = (daysAgo: number) => {
    if (daysAgo === 0) {
        return "Today";
    } else if (daysAgo === 1) {
        return "Yesterday";
    } else if (daysAgo < 31) {
        return daysAgo.toString() + " days ago";
    } else if (daysAgo < 61) {
        return "1 month ago";
    } else if (daysAgo < 365) {
        return Math.floor(daysAgo / 30).toString() + " months ago";
    } else {
        return Math.floor(daysAgo / 365).toString() + " years ago";
    }
};

// Other formatting
export const truncateText = (text: string, maxLength: number) => {
    let truncatedText = text;

    truncatedText = truncatedText.replace(/\\n/g, "\n");

    const firstNewLine = truncatedText.indexOf("\n");
    if (firstNewLine !== -1) {
        truncatedText = truncatedText.substring(0, firstNewLine);
    } else if (truncatedText.length > maxLength) {
        truncatedText = truncatedText.substring(0, maxLength) + "...";
    }

    return truncatedText.replace(/\n$/, "");
};

// Key transformation from snake_case
export const camelCase = (str: string) => {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", "")
    );
};

export function keysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(keysToCamelCase);
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (acc, key) => ({
                ...acc,
                [camelCase(key)]: keysToCamelCase(obj[key]),
            }),
            {}
        );
    }
    return obj;
}

export function snakeCaseToCamelCase<T>(obj: SnakeCaseObject<T>): T {
    if (Array.isArray(obj)) {
        return obj.map(keysToCamelCase) as T;
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (acc, key) => ({
                ...acc,
                [camelCase(key)]: keysToCamelCase((obj as any)[key]),
            }),
            {} as T
        );
    }
    return obj as T;
}

// Links logic
export function encodeIdentifier(ids: string[]): string {
    return encodeURIComponent(ids.join("~"));
}

export function decodeIdentifier(encoded: string): string[] {
    return decodeURIComponent(encoded).split("~");
}

export function constructLink(userIds?: string[], teamIds?: string[], baseLink?: string) {
    const { identifier, error, isLoading } = useIdentifier(userIds || [], []);
    const href = identifier ? `/${identifier}${baseLink}` : baseLink;

    const shouldRenderLink =
        (baseLink && userIds && userIds.length > 0) || (teamIds && teamIds.length > 0);
    // teamIds.length > 0;

    return { href, shouldRenderLink };
}

// Shallow equal util
export const shallowEqual = (obj1: any, obj2: any) => {
    if (obj1 === obj2) return true;
    if (!obj1 || !obj2) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
};
