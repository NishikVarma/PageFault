import { Issue } from '../types';

export function detectMissingDescription(issues: Issue[], snapshot: string, url: string) {
    const lines = snapshot.split("\n");
    for (const line of lines) {
        if (line.includes("- img")) {
            if (!line.includes("\"")) {
                issues.push({ url, element: line.trim(), issue: "No alt text provided for image" });
            }
        } else if (line.includes("- link")) {
            if (line.includes("\"hidden\"")) {
                issues.push({ url, element: line.trim(), issue: "Non-descriptive link label" });
            }
        }
    }
}