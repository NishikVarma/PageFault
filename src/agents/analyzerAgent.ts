import { Issue } from "../types";

interface AnalyzerInput {
    url : string,
    truncatedSnapshot : string,
    issues : Issue[]
}

export async function analyze(input: AnalyzerInput): Promise<Issue[]> {
    const url = input.url;
    const issues = input.issues;
    const snapshot = input.truncatedSnapshot;
    const uniqueIssueStrings = [...new Set(issues.map(i => `- ${i.issue}`))].join("\n");

    const userMessage = `
        Page URL: ${url}

        Already Detected Issues:
        ${uniqueIssueStrings}

        ARIA Snapshot:
        ${snapshot}
        `;

    const SYSTEM_PROMPT = `You are a web accessibility and UX analyst. Your job is to identify bugs that rule-based detectors cannot catch — such as confusing navigation structure, missing calls to action, illogical content hierarchy, and poor semantic flow that makes pages hard to understand in context.

You will receive:
- The page URL
- An ARIA snapshot of the page
- A list of already detected issues (do not repeat these)

You must respond with ONLY a JSON array. Do not write any text before or after it. No markdown, no explanation, no preamble. If you find no additional issues, respond with an empty array [].

Each issue must follow this exact shape:
{ "element": string, "issue": string, "severity": "high" | "medium" | "low" }

Severity guide:
- high: bugs that cause major hindrance in user workflow or indicate a security issue
- medium: bugs that silently affect the user experience without being immediately obvious
- low: bugs that cause confusion but do not block the user`

    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await fetch("http://localhost:11434/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "mistral",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userMessage }
                    ]
                })
            }); 

            const data = await response.json() as any;
            const text = data.choices[0].message.content;
            
            const cleaned = text.replace(/```json|```/g, "").trim();

            const start = cleaned.indexOf("[");
            const end = cleaned.lastIndexOf("]");
            if (start === -1 || end === -1) throw new Error("No JSON array found");

            const jsonString = cleaned.substring(start, end + 1);
            const parsed = JSON.parse(jsonString);

            if (!Array.isArray(parsed)) throw new Error("Not an array");

            const validIssues = parsed.filter((item: any) =>
                typeof item.element === "string" &&
                typeof item.issue === "string" &&
                ["high", "medium", "low"].includes(item.severity)
            );

            return validIssues; 
        } catch (err) {
            if (attempt === 2) console.warn(`  ⚠ LLM analysis failed for ${url} — skipping`);
        }
    }

    return []; 
}