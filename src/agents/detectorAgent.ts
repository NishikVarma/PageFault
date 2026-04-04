import { Issue } from "../types";
import {
  detectVagueLinkText,
  detectMissingDescription,
  detectBrokenLinks,
  detectButtonWithNoTextLabels,
  detectLinkWithDuplicateValues,
  detectMultipleHeading,
  detectHeadingHeirarchyViolation,
  detectUnlabelledFormFields,
} from "../detectors/index";

const detectors = [
  detectVagueLinkText,
  detectMissingDescription,
  detectBrokenLinks,
  detectButtonWithNoTextLabels,
  detectLinkWithDuplicateValues,
  detectMultipleHeading,
  detectHeadingHeirarchyViolation,
  detectUnlabelledFormFields,
];


export function detectIssues( snapshot : string ) : Issue[] {
    const pageIssues: Issue[] = [];
    for (const detector of detectors) {
      detector(pageIssues, snapshot);
    }

    return pageIssues;
}
