import { getWorkVersionedFields } from "@/src/config/worksVersionedFields.config";
import {
    generateRandomInteger,
    generateRandomString,
    generateStringModification,
} from "@/tests/utils/generateRandomData";
import { TextDiff } from "@/src/types/versionControlTypes";
import { Work } from "@/src/types/workTypes";
import { applyTextDiffs } from "@/src/modules/version-control-system/diff-logic/applyTextDiff";
import { calculateDiffs } from "@/src/modules/version-control-system/diff-logic/calculateTextDiffs";

describe("Text Diffing Test", () => {
    it("correctly generates and applies diffs", () => {
        const initialText = generateRandomString(1000);
        const modifiedText = generateStringModification(initialText);
        const textDiffs = calculateDiffs(initialText, modifiedText);
        const reconstructedText = applyTextDiffs(initialText, textDiffs);

        expect(reconstructedText).toEqual(modifiedText);
    });

    it("correctly generates and applies sequential diffs", () => {
        const numberOfSubsequentDiffs = generateRandomInteger(10);
        const initialText = generateRandomString(1000);
        let modifiedText = initialText;
        let diffPacks: TextDiff[][] = [];

        for (let i = 0; i < numberOfSubsequentDiffs; i++) {
            const modification = generateStringModification(modifiedText);
            const diffs = calculateDiffs(modifiedText, modification);
            diffPacks.push(diffs);
            modifiedText = modification;
        }

        let diffResult = initialText;

        for (let i = 0; i < numberOfSubsequentDiffs; i++) {
            diffResult = applyTextDiffs(diffResult, diffPacks[i]);
        }
        
        expect(diffResult).toEqual(modifiedText);
    })
    // it("correctly applies a work submission's delta diffs to a work", () => {
    //     const initialWork = generateWork("Dataset");
    //     const { workSubmission, expectedFinalWork } = generateWorkSubmission(initialWork);

    //     const reconstructedFinalWork = getFinalVersionWorkRecord(initialWork, workSubmission.workDelta.textDiffs);
        
    //     expect(reconstructedFinalWork).toEqual(expectedFinalWork);
    // })
});

// it("correctly generates and applies text for a single submission", async () => {
//     const initialWork = generateWork();
//     let finalWork: Record<string, string> = {};

//     let textDiffs: WorkTextFieldsDiffs = {};

//     for (const field in getWorkVersionedFields("Dataset")) {
//         const initialWorkField = (initialWork[field as WorkKey] as string) || "";
//         const fieldModification = generateStringModification(initialWorkField);
//         finalWork[field] = fieldModification;

//         const textDiff = calculateDiffs(initialWorkField, fieldModification);
//         textDiffs[field as keyof WorkTextFieldsDiffs] = textDiff;
//     }

// });
