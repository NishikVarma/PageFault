import { Issue } from '../types';

export function detectLinkWithDuplicateValues(issues: Issue[], snapshot: string, url: string) {
    const lines = snapshot.split("\n");
    const map = new Map<string, string>();

    for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i].includes("- link")) {
            const firstQuote = lines[i].indexOf("\"");
            const secondQuote = lines[i].indexOf("\"", firstQuote + 1);
            const linkLabel = lines[i].substring(firstQuote + 1, secondQuote).trim();

            const urlValue = lines[i + 1].substring(lines[i + 1].indexOf(":") + 1).trim();

            if (!map.has(linkLabel)) {
                map.set(linkLabel, urlValue);
            } else {
                if (map.get(linkLabel) !== urlValue) {
                    issues.push({ url, element: lines[i].trim(), issue: "Duplicate link label pointing to different URLs" });
                }
            }
        }
    }
}