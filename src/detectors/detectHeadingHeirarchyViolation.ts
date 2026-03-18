import { Issue } from "../types";

export function detectHeadingHeirarchyViolation(
  issues: Issue[],
  snapshot: string,
) {
  const lines = snapshot.split("\n");

  var currentLevel = 0;
  var previousLevel = -1;

  for (const line of lines) {
    if (line.includes("- heading")) {
      var start = line.indexOf("[level=") + 7;
      var value = line.substring(start, start + 1);

      currentLevel = Number(value);

      if (previousLevel == -1) {
        previousLevel = currentLevel;
        continue;
      }
      if (currentLevel <= previousLevel) {
        previousLevel = currentLevel;
        continue;
      } else {
        if (currentLevel != previousLevel + 1) {
          issues.push({
            element: line,
            issue: "Heading heirarchy has been violated",
            severity: "low"
          });
        }
        previousLevel = currentLevel;
      }
    }
  }
}
