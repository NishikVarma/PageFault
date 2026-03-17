import { Issue } from "../types";

export function detectUnlabelledFormFields(issues: Issue[], snapshot: string, url: string){
    const lines = snapshot.split("\n");

    for(const line of lines){
        if(line.includes("- textbox") || line.includes("- radio") || line.includes("- checkbox")){
            if(!line.includes("\"")){
                issues.push({url: url, element: line, issue: "Form field is unlabelled"});
            }
        }
    }
}