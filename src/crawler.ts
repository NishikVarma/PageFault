import { firefox } from "playwright";
import { Issue, PageReport, Report } from "./types";

import fs from "fs";

const filePath = "../bug-hygiene-engine/reports/report.json";

import {
  detectVagueLinkText,
  detectMissingDescription,
  detectBrokenLinks,
  detectButtonWithNoTextLabels,
  detectLinkWithDuplicateValues,
  detectMultipleHeading,
  detectHeadingHeirarchyViolation,
  detectUnlabelledFormFields,
} from "./detectors/index";

const urls = [
  // "https://onlinesbi.sbi.bank.in/",
  "https://www.google.com",
  // "https://www.w3schools.com/html/html_forms.asp",
];

const stack = urls.map(url => ({url, depth: 0}));
const visited = new Set<string>();
const maxdepth = 1;

const detectors = [
  detectVagueLinkText,
  detectMissingDescription,
  detectBrokenLinks,
  detectButtonWithNoTextLabels,
  detectLinkWithDuplicateValues,
  detectMultipleHeading,
  detectHeadingHeirarchyViolation,
  detectUnlabelledFormFields,
];

(async () => {
  console.log("Crawling automatically till depth = 1");
  const browser = await firefox.launch();
  const page = await browser.newPage();

  const pages: PageReport[] = [];
  var totIssue = 0;

  while (stack.length > 0) {
    const { url, depth } = stack.pop()!;
    if(visited.has(url)) continue;
    visited.add(url);

    await page.goto(url);
    const title = await page.title();
    console.log("Checking: " + title);
    const snapshot = await page.locator("body").ariaSnapshot();

    const lines = snapshot.split("\n");
    for(let i =0 ; i < lines.length -1 ; i++){
      if(lines[i].includes("- link") && lines[i+1].includes("/url:")){
        let newUrl = lines[i+1].substring(lines[i+1].indexOf("/url:") + 5).trim();
        const resolvedUrl = new URL(newUrl, url);
        if((new URL(url).hostname == resolvedUrl.hostname) && depth < maxdepth){
          stack.push({url: resolvedUrl.href, depth: depth+1});
        }
      }
    }

    const pageIssues: Issue[] = [];

    for (const detector of detectors) {
      detector(pageIssues, snapshot);
    }

    pages.push({
      url: url,
      title: title,
      score: calculateScore(pageIssues),
      issueCount: pageIssues.length,
      issues: pageIssues,
    });
    totIssue += pageIssues.length;
  }

  const report: Report = {
    generatedAt: new Date().toISOString(),
    totalIssues: totIssue,
    pages: pages,
  };
  const jsonData = JSON.stringify(report, null, 2);

  try {
    fs.writeFileSync(filePath, jsonData);
    console.log("Report written successfully");
  } catch (err) {
    console.log("Error writing file: " + err);
  }

  await browser.close();
})();

function calculateScore(issues: Issue[]): number{
  var score = 100;
  for(const issue of issues){
    if(issue.severity == "high"){
      score = score - 10;
    }else if(issue.severity == "medium"){
      score = score - 5;
    }else{
      score = score - 2;
    }
  }

  score = Math.max(0, score);
  return score;
}