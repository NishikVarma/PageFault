import { Issue } from "./types";
import { detectHeadingHeirarchyViolation } from './detectors/detectHeadingHeirarchyViolation'

const snapshot = `- heading "Title" [level=1]:
- heading "Skipped to h3" [level=3]:`;

const issues: Issue[] = [];
detectHeadingHeirarchyViolation(issues, snapshot, "www.google.com");

console.log(issues);