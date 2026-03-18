import { Issue } from "../types";

export function detectMultipleHeading(issues: Issue[], snapshot: string) {
  const lines = snapshot.split("\n");
  var count = 0;
  for (const line of lines) {
    if (line.includes("- heading")) {
      if (line.includes("[level=1]")) {
        count++;
      }
    }
  }

  if (count > 1) {
    issues.push({
      element: `${count} headings found`,
      issue: "Multiple h1 headings on a single page",
      severity: "low"
    });
  }
}
