import fs from 'fs';
import { Report } from './types';

export function generateHTML(report : Report) : string{
    const template = fs.readFileSync('./templates/report.template.html', 'utf-8');

    let html = template.replace("{{generatedAt}}", report.generatedAt);
    html = html.replace("{{totalIssues}}", report.totalIssues.toString());
    html = html.replace("{{pageCount}}", report.pages.length.toString());
    let pagesContent = "";
    for(const page of report.pages){
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
        pageCardHtml = pageCardHtml.replace("{{scoreClass}}", getScoreClass(page.score));
        
        let pageIssue = "";
        for(const issue of page.issues){
            let issueHtml = `<div class="issue {{severity}}">
    <div class="issue-label">{{issue}}</div>
    <div class="issue-element">{{element}}</div>
</div>`;
            issueHtml = issueHtml.replace("{{severity}}", issue.severity);
            issueHtml = issueHtml.replace("{{issue}}", issue.issue);
            issueHtml = issueHtml.replace("{{element}}", issue.element);

            pageIssue += issueHtml;
        }
        pageCardHtml = pageCardHtml.replace("{{issues}}", pageIssue);
        pagesContent += pageCardHtml + "\n"; 
    }

    html = html.replace("{{pages}}", pagesContent);
    return html;
}

function getScoreClass(score : number) : string{
    if( score >= 90) return "high";
    if( score >= 50) return "medium";
    else return "low";
}

/*
<div class="page-card">
    <div class="page-header">
        <div>
            <div class="page-title">{{title}}</div>
            <div class="page-url">{{url}}</div>
        </div>
        <div class="score {{scoreClass}}">{{score}}/100</div>
    </div>
    {{issues}}
</div>

<div class="issue {{severity}}">
    <div class="issue-label">{{issue}}</div>
    <div class="issue-element">{{element}}</div>
</div>
*/

