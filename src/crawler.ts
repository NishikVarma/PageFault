import { firefox } from 'playwright';
import { Issue } from './types';
import {
    detectVagueLinkText,
    detectMissingDescription,
    detectBrokenLinks,
    detectButtonWithNoTextLabels,
    detectLinkWithDuplicateValues,
    detectMultipleHeading,
    detectHeadingHeirarchyViolation,
    detectUnlabelledFormFields
} from './detectors/index';

const urls = [
    // "https://onlinesbi.sbi.bank.in/",
    // "https://www.google.com"
    "https://www.w3schools.com/html/html_forms.asp"
];

const detectors = [
    detectVagueLinkText,
    detectMissingDescription,
    detectBrokenLinks,
    detectButtonWithNoTextLabels,
    detectLinkWithDuplicateValues,
    detectMultipleHeading,
    detectHeadingHeirarchyViolation,
    detectUnlabelledFormFields
];

(async () => {
    const browser = await firefox.launch();
    const page = await browser.newPage();

    const issues: Issue[] = [];

    for (const url of urls) {
        await page.goto(url);
        const title = await page.title();
        console.log("Checking: " + title);
        const snapshot = await page.locator('body').ariaSnapshot();

        // console.log(snapshot);
        for (const detector of detectors) {
            detector(issues, snapshot, url);
        }
    }

    console.log(issues);

    await browser.close();
})();