import { Issue } from '../types';

export function detectVagueLinkText(issues: Issue[], snapshot: string, url: string) {
    const lines = snapshot.split("\n");
    for (const line of lines) {
        if (line.includes("- link")) {
            if (line.includes("click here") || line.includes("here")) {
                issues.push({ url, element: line.trim(), issue: "Vague link text" });
            }
        }
    }
}