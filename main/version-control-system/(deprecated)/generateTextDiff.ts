// not used currently

import { TextDiff } from "@/types/versionControlTypes";

let lastDiffs: TextDiff[] = []; // maintains state between calls

export const generateTextDiff = (
    original: string,
    modified: string,
    existingDiffs: TextDiff[]
  ): void => {
    // Clear existing diffs
    existingDiffs.length = 0;
  
    let i = 0, j = 0;
    
    while (i < original.length || j < modified.length) {
      if (original[i] !== modified[j]) {
        let deleteCount = 0;
        let insert = "";
  
        // Count deletions
        let temp_i = i;
        while (temp_i < original.length && original[temp_i] !== modified[j]) {
          temp_i++;
          deleteCount++;
        }
  
        // Capture insertions
        let temp_j = j;
        while (temp_j < modified.length && modified[temp_j] !== original[temp_i]) {
          insert += modified[temp_j];
          temp_j++;
        }
  
        existingDiffs.push({ position: i, deleteCount, insert });
  
        i = temp_i + deleteCount;
        j = temp_j;
      } else {
        i++;
        j++;
      }
    }
  
    if (i < original.length) {
      existingDiffs.push({ position: i, deleteCount: original.length - i, insert: "" });
    }
  
    if (j < modified.length) {
      existingDiffs.push({ position: i, deleteCount: 0, insert: modified.slice(j) });
    }
  };
