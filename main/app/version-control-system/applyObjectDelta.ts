import { ObjectDelta } from "@/types/versionControlTypes";
import { applyTextDiffs } from "./diff-logic/applyTextDiff";

export function applyObjectDelta<T>(originalObj: T, delta: ObjectDelta<T>): T {
    const newObj: Partial<T> = { ...originalObj };
  
    for (const key in delta) {
        const actualKey = key as keyof T;
        const diffs = delta[actualKey as string]; 
  
        if (Array.isArray(diffs)) {
          newObj[actualKey] = applyTextDiffs(originalObj[actualKey] as unknown as string, diffs) as unknown as T[keyof T];
        } else if (typeof diffs === 'object') {
          newObj[actualKey] = applyObjectDelta(originalObj[actualKey] as unknown as object, diffs as ObjectDelta<any>) as unknown as T[keyof T];
        }
    }
  
    return newObj as T;
  }
  
  