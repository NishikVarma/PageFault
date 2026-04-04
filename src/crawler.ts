import { firefox } from "playwright";
import { Issue, PageReport, Report } from "./types";
import { program } from "commander";

import { analyze } from "./agents/analyzerAgent";
import { calculateScore } from "./agents/scorerAgent";
import { detectIssues } from "./agents/detectorAgent";
import { genReport } from "./agents/reporterAgent";
import { crawl } from "./agents/crawlerAgent";

import { generateHTML } from "./reporter";

import fs from "fs";
const filePath = "../bug-hygiene-engine/reports/report.json";

program
  .argument('<url>', 'URL to crawl')
  .option('-d, --depth <number>', 'crawl number', '1')
  .parse();

const url = program.args[0];
const maxdepth = parseInt(program.opts().depth);

const stack = [{url, depth: 0}];
const visited = new Set<string>();

(async () => {
  console.log(`Crawling automatically till depth = ${maxdepth}`);
  const browser = await firefox.launch();
  const page = await browser.newPage();
  
  const crawledPages = await crawl(url, maxdepth);
  const pages: PageReport[] = [];
  var totIssue = 0;

  for (const crawledPage of crawledPages) {
    const { url, title, snapshot } = crawledPage;
    
    const pageIssues: Issue[] = detectIssues(snapshot);

    console.log(`Running LLM analysis on ${url}...`);
    const MAX_CHARS = 4000;
    const truncatedSnapshot = snapshot.length > MAX_CHARS
        ? snapshot.substring(0, snapshot.lastIndexOf("\n", MAX_CHARS)) + "\n...[truncated]"
        : snapshot;
    const llmIssues = await analyze({ url, truncatedSnapshot, issues: pageIssues });
    console.log(`LLM found ${llmIssues.length} additional issues`);

    pageIssues.push(...llmIssues);

    pages.push({
      url: url,
      title: title,
      score: calculateScore(pageIssues),
      issueCount: pageIssues.length,
      issues: pageIssues,
    });
    totIssue += pageIssues.length;
  }

  genReport(pages, totIssue);
})();
