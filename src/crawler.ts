import { firefox } from "playwright";
import { Issue, PageReport, Report } from "./types";
import { program } from "commander";

import { analyze } from "./agents/analyzerAgent";
import { calculateScore } from "./agents/scorerAgent";
import { detectIssues } from "./agents/detectorAgent";
import { genReport } from "./agents/reporterAgent";
import { crawl } from "./agents/crawlerAgent";

import { generateHTML } from "./reporter";

program
  .argument('<url>', 'URL to crawl')
  .option('-d, --depth <number>', 'crawl number', '1')
  .parse();

const url = program.args[0];
const maxdepth = parseInt(program.opts().depth);

(async () => {
  console.log(`\n PageFault — Web Accessibility Engine`);
  console.log(`  Target : ${url}`);
  console.log(`  Depth  : ${maxdepth}\n`);
  
  const crawledPages = await crawl(url, maxdepth);

  if(crawledPages.length==1 || crawledPages.length == 0) console.log(`Discovered ${crawledPages.length} page...`);
  else console.log(`Discovered ${crawledPages.length} page...`);

  
  const pages: PageReport[] = [];
  var totIssue = 0;

  for (const crawledPage of crawledPages) {
    const { url, title, snapshot } = crawledPage;
    const pageIssues: Issue[] = detectIssues(snapshot);
    console.log(`  ↳ Analyzing ${url}`);

    const MAX_CHARS = 4000;
    const truncatedSnapshot = snapshot.length > MAX_CHARS
        ? snapshot.substring(0, snapshot.lastIndexOf("\n", MAX_CHARS)) + "\n...[truncated]"
        : snapshot;
    const llmIssues = await analyze({ url, truncatedSnapshot, issues: pageIssues });

    console.log(`    ✓ ${pageIssues.length} issues detected`);


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
  console.log(`\n  Report saved → reports/report.html`);
  console.log(`  Total issues : ${totIssue}`);
  console.log(`  Pages scanned: ${pages.length}\n`);
})();
