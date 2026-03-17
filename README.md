# PageFault

> A rule-based web accessibility and hygiene engine that autonomously crawls, analyzes, and classifies defects — essentially a self-driven QA inspector.

---

## What is this?

PageFault crawls any web page, grabs its ARIA accessibility snapshot, and runs it through a set of rule-based detectors to find bugs and hygiene issues.

No vision models. No screenshots. Just structured analysis of what the browser actually exposes — keeping LLM usage minimal and rule-based detection maximal.

---

## How it works

1. **Crawl** — Playwright launches a browser, navigates to each URL, and captures the page's ARIA snapshot — a structured, human-readable tree of every accessible element on the page.

2. **Detect** — The snapshot is passed through rule-based detector functions. Each detector looks for a specific pattern and pushes structured issues into a shared array.

3. **Classify** — Issues are tagged by type and element, building toward a structured Defect Knowledge Graph linking pages → elements → issue types → severity.

4. **Report** — Issues are output as structured JSON, each with:
   ```json
   {
     "url": "https://example.com",
     "element": "- link \"hidden\":",
     "issue": "Non-descriptive link label"
   }
   ```

### Current Detectors

| Detector | What it catches |
|---|---|
| `detectVagueLinkText` | Links with non-descriptive labels like "hidden", "click here" |
| `detectMissingDescription` | Images with no alt text, links with no readable label |
| `detectBrokenLinks` | Empty URLs or `javascript:void(0)` links |
| `detectButtonWithNoTextLabels` | Buttons with empty or missing label text |
| `detectLinkWithDuplicateValues` | Same link label pointing to different URLs |

---

## Focus Areas

| Area | Status |
|---|---|
| Bug Detection | 🟡 In progress |
| Hygiene Classification | 🟡 Partial |
| Quality Engineering | 🟡 Partial |
| Autonomous Discovery | ⬜ Planned |
| AI Agents | ⬜ Planned |
| Testing Performance | ⬜ Planned |
| Mobile Applications | ⬜ Planned |
| Defect Scoring | ⬜ Planned |
| Visualization | ⬜ Planned |

---

## Roadmap

- [ ] More rule-based detectors (heading hierarchy, form labels, multiple h1s)
- [ ] JSON/HTML report file output
- [ ] Hygiene score per page based on issue density and type mix
- [ ] Autonomous link discovery — crawl pages found on a root URL automatically
- [ ] Defect Knowledge Graph: pages → elements → issue types → severity
- [ ] LLM layer for subjective issues (navigation logic, content quality) — minimal usage
- [ ] Visualization dashboard
- [ ] Mobile testing support

---

## Stack

- [Playwright](https://playwright.dev) — browser automation + ARIA snapshots
- TypeScript — because types catch bugs before runtime does

---

*Built from scratch as a learning project. Every detector was written by hand — no AI-generated logic.*