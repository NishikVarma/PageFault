import { Issue } from '../types';

const intentionalDuplicates = [
    "try it yourself »",
    "see more",
    "learn more",
    "read more",
    "view more",
    "click here",
    "here",
    "more",
    "next",
    "previous",
    "next ❯",
    "❮ previous",
    "back",
    "continue",
    "submit",
    "cancel",
    "close",
    "open",
    "show more",
    "show less",
    "load more",
    "see all",
    "view all",
    "get started",
    "sign in",
    "log in",
    "sign up"
];

export function detectLinkWithDuplicateValues(issues: Issue[], snapshot: string, url: string) {
    const lines = snapshot.split("\n");
    const map = new Map<string, string>();

    for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i].includes("- link")) {
            const firstQuote = lines[i].indexOf("\"");
            const secondQuote = lines[i].indexOf("\"", firstQuote + 1);
            const linkLabel = lines[i].substring(firstQuote + 1, secondQuote).trim();

            const urlValue = lines[i + 1].substring(lines[i + 1].indexOf(":") + 1).trim();

            if(intentionalDuplicates.includes(linkLabel.toLowerCase())){
                continue;
            }

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