import { Issue } from "../types";

export function calculateScore(issues: Issue[]): number{
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