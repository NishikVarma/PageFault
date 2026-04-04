export interface Issue {
  element: string;
  issue: string;
  severity: "high" | "medium" | "low";
}

export interface PageReport {
  url: string;
  title: string;
  score: number,
  issueCount: number;
  issues: Issue[];
}

export interface Report {
  generatedAt: string;
  totalIssues: number;
  pages: PageReport[];
}

export interface CrawledPage {
    url: string;
    title: string;
    snapshot: string;
}
