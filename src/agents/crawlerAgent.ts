import { firefox } from "playwright";
import { CrawledPage } from "../types";

interface StackItem {
    url: string;
    depth: number;
}

export async function crawl(seedUrl: string, maxDepth: number): Promise<CrawledPage[]> {
    const stack: StackItem[] = [{ url: seedUrl, depth: 0 }];
    const visited = new Set<string>();
    const results: CrawledPage[] = [];

    const browser = await firefox.launch();
    const page = await browser.newPage();

    while (stack.length > 0) {
        const { url, depth } = stack.pop()!;
        if (visited.has(url)) continue;
        visited.add(url);

        try {
            await page.goto(url, { timeout: 10000 });
            const title = await page.title();
            const snapshot = await page.locator("body").ariaSnapshot();

            console.log(`Checking: ${title}`);
            results.push({ url, title, snapshot });

            if (depth < maxDepth) {
                const lines = snapshot.split("\n");
                for (let i = 0; i < lines.length - 1; i++) {
                    if (lines[i].includes("- link") && lines[i + 1].includes("/url:")) {
                        const newUrl = lines[i + 1].substring(lines[i + 1].indexOf("/url:") + 5).trim();
                        try {
                            const resolvedUrl = new URL(newUrl, url);
                            if (resolvedUrl.hostname === new URL(url).hostname && !visited.has(resolvedUrl.href)) {
                                stack.push({ url: resolvedUrl.href, depth: depth + 1 });
                            }
                        } catch {
                            // skip malformed URLs
                        }
                    }
                }
            }
        } catch (err) {
            console.log(`Failed to crawl ${url}: ${err}`);
        }
    }

    await browser.close();
    return results;
}