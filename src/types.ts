export interface Issue {
  element: string;
  issue: string;
}

export interface PageReport {
  url: string;
  title: string;
  issueCount: number;
  issues: Issue[];
}

export interface Report {
  generatedAt: string;
  totalIssues: number;
  pages: PageReport[];
}
