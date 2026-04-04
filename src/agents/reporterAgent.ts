import fs from "fs";
import { PageReport, Report } from "../types";

const JSONFilePath = "../bug-hygiene-engine/reports/report.json";
const HTMLFilePath = "../bug-hygiene-engine/reports/report.html";

function getScoreClass(score: number): string {
  if (score >= 90) return "high";
  if (score >= 50) return "medium";
  else return "low";
}

function escapeHTML(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function generateHTML(report: Report): string {
  const template = fs.readFileSync("./templates/report.template.html", "utf-8");

  const genAt = new Date(report.generatedAt);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let html = template.replace(
    "{{generatedAt}}",
    genAt.toLocaleTimeString() +
      ", " +
      genAt.toLocaleDateString("en-US", options),
  );
  html = html.replace("{{totalIssues}}", report.totalIssues.toString());
  html = html.replace("{{pageCount}}", report.pages.length.toString());
  let pagesContent = "";
  for (const page of report.pages) {
    let pageCardHtml = `<div class="page-card">
    <div class="page-header">
        <div>
            <div class="page-title">{{title}}</div>
            <div class="page-url">{{url}}</div>
        </div>
        <div class="score {{scoreClass}}">{{score}}/100</div>
    </div>
    {{issues}}
</div>`;
    pageCardHtml = pageCardHtml.replace("{{title}}", page.title);
    pageCardHtml = pageCardHtml.replace("{{url}}", page.url);
    pageCardHtml = pageCardHtml.replace("{{score}}", page.score.toString());
    pageCardHtml = pageCardHtml.replace(
      "{{scoreClass}}",
      getScoreClass(page.score),
    );

    let pageIssue = "";
    for (const issue of page.issues) {
      let issueHtml = `<div class="issue {{severity}}">
    <div class="issue-label">{{issue}}</div>
    <div class="issue-element">{{element}}</div>
</div>`;
      issue.issue = escapeHTML(issue.issue)
      issue.element = escapeHTML(issue.element)
      issueHtml = issueHtml.replace("{{severity}}", issue.severity);
      issueHtml = issueHtml.replace("{{issue}}", issue.issue);
      issueHtml = issueHtml.replace("{{element}}", issue.element);

      pageIssue += issueHtml;
    }

    if (page.issueCount == 0) {
      pageCardHtml = pageCardHtml.replace(
        "{{issues}}",
        `<div class="no-issues">No issues found.</div>`,
      );
    } else {
      pageCardHtml = pageCardHtml.replace("{{issues}}", pageIssue);
    }
    pagesContent += pageCardHtml + "\n";
  }

  html = html.replace("{{pages}}", pagesContent);
  return html;
}

export function genReport(pages : PageReport[], totalIssues: number) {
  const report: Report = {
    generatedAt: new Date().toISOString(),
    totalIssues: totalIssues,
    pages: pages,
  };
  
  const jsonData = JSON.stringify(report, null, 2);
  const html = generateHTML(report);

  try {
    fs.writeFileSync(JSONFilePath, jsonData);
    fs.writeFileSync(HTMLFilePath, html);

    console.log("Report written successfully");
  } catch (err) {
    console.log("Error writing file: " + err);
  }

}
