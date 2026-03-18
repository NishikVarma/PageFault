import { Issue } from "../types";

export function detectBrokenLinks(issues: Issue[], snapshot: string) {
  const lines = snapshot.split("\n");
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes("- link")) {
      const afterColon = lines[i + 1].substring(lines[i + 1].indexOf(":") + 1);
      if (afterColon.trim() === "") {
        issues.push({
          element: lines[i].trim(),
          issue: "No URL for link given",
          severity: "high"
        });
      } else if (afterColon.trim() === "javascript:void(0)") {
        issues.push({
          element: lines[i].trim(),
          issue: "Non-functional or JS-dependent link",
          severity: "high"
        });
      }
    }
  }
}
