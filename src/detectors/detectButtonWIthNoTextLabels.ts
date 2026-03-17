import { Issue } from '../types';

export function detectButtonWithNoTextLabels(issues: Issue[], snapshot: string, url: string) {
    const lines = snapshot.split("\n");
    for (const line of lines) {
        if (line.includes("- button")) {
            if (line.includes("\"")) {
                const firstQuote = line.indexOf("\"");
                const secondQuote = line.indexOf("\"", firstQuote + 1);
                const inQuotes = line.substring(firstQuote + 1, secondQuote).trim();
                if (inQuotes === "") {
                    issues.push({ url, element: line.trim(), issue: "Button with no text label" });
                }
            }
        }
    }
}