import { getWorkVersionedFields } from "@/src/config/worksVersionedFields.config";
import { WorkDelta, WorkSubmission } from "@/src/types/versionControlTypes";
import { Work, WorkType } from "@/src/types/workTypes";
import { calculateDiffs } from "@/src/modules/version-control-system/diff-logic/calculateTextDiffs";

export const generateRandomInteger = (max: number) => {
    return Math.floor(Math.random() * max);
};

export const generateRandomSign = () => {
    return Math.random() < 0.5 ? -1 : 1;
}

export const generateRandomString = (length: number): string => {
    return (Math.random() + 1).toString(36).substring(1, length - 1);
};

export const generateWork = (workType: WorkType): Work => {
    const work: Work = {
        id: generateRandomInteger(100),
        title: generateRandomString(generateRandomInteger(100)),
        description: generateRandomString(generateRandomInteger(100)),
        workType: workType,
    };

    return work;
}

export const generateStringModification = (original: string): string => {
    let modified = original;
    const numberOfModifications = Math.max(1, Math.floor(original.length / 100));

    for (let i = 0; i < numberOfModifications; i++) {
        // Randomly decide between insertion and deletion
        if (Math.random() > 0.5 && modified.length > 10) {
            // Perform a deletion
            const deleteStart = generateRandomInteger(modified.length - 10);
            const deleteEnd = deleteStart + generateRandomInteger(Math.min(10, modified.length - deleteStart));
            modified = modified.substring(0, deleteStart) + modified.substring(deleteEnd);
        } else {
            // Perform an insertion
            const insertPosition = generateRandomInteger(modified.length);
            const stringToInsert = generateRandomString(generateRandomInteger(10));
            modified = modified.substring(0, insertPosition) + stringToInsert + modified.substring(insertPosition);
        }
    }

    return modified;
};


interface GenerateSubmissionOutput {
    workSubmission: WorkSubmission;
    expectedFinalWork: Work;
}

// export const generateWorkSubmission = (work: Work): GenerateSubmissionOutput => {
//     let finalWork = { ... work };
//     let workSubmission: WorkSubmission = {
//         id: generateRandomInteger(100),
//         workId: work.id,
//         workType: work?.workType || "",
//         initialWorkVersionId: work?.currentWorkVersionId || 0,
//         finalWorkVersionId: generateRandomInteger(100),
//         workDelta: { textDiffs: {} },
//     };

//     let textDiffs: WorkTextDiffsFields = {};

//     // Generate modifications and diffs for all versioned fields
//     for (const field in getWorkVersionedFields(work?.workType || "")) {
//         const initialWorkField = (work[field as WorkKey] as string) || "";
//         const fieldModification = generateStringModification(initialWorkField);
//         const textDiff = calculateDiffs(initialWorkField, fieldModification);

//         textDiffs[field as keyof WorkTextDiffsFields] = textDiff;
//         (finalWork[field as WorkKey] as string) = fieldModification;
//     }

//     workSubmission.workDelta.textDiffs = textDiffs;

//     return {
//         workSubmission: workSubmission,
//         expectedFinalWork: finalWork,
//     }
// }
