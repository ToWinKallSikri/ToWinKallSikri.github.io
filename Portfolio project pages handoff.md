# Handoff: Portfolio project case-study pages

## Goal

Enrich the GitHub Pages portfolio at https://github.com/ToWinKallSikri/ToWinKallSikri.github.io so that each project card on `index.html` becomes clickable and opens a dedicated case-study page. Each page should explain what was done in detail, with pictures and a description drawn from the reports in the repo's `/Relevant_Material` folder.

The pages must **highlight what I did and the project decisions I made (and why)**, not just list technologies.

Also add two new projects:
- EF Core C# booking API: https://github.com/ToWinKallSikri/Sikri_Twinkal_PAdP_T04
- Vector Rally (Java): https://github.com/ToWinKallSikri/Progetto_F1_Sikri_Twinkal (already has a card, so link it to the repo)

## Writing rules (important)

- UK English and UK spelling.
- No long dashes (em dashes) anywhere.
- No emojis and no exclamation points.
- Natural, human voice. It must not sound AI-generated.
- Accurate claims only. Keep established skills separate from things still being learned. Do not inflate results.

## Current state

- `index.html` is **unchanged**. Projects section is roughly lines 471 to 589. Existing styles are in `css/resume.css` (CSS variables such as `--primary: #345b78`, fonts Lora and Source Sans 3) and `js/resume.js`.
- Groundwork already built and saved in the zip "Portfolio project pages (work in progress)" (unzip into the repo root):
  - `img/projects/<slug>/*.webp`: 34 optimised images (list below).
  - `css/project.css`: case-study page styles reusing the site's colours and fonts.
  - `js/project.js`: gallery lightbox (click to enlarge, Esc to close).
  - `tools/build-projects.mjs`: Node script that generates `projects/<slug>.html` from `content/projects.json` using `index.html` as the template for header/footer. **`content/projects.json` does not exist yet**, so either write it or drop the script and hand-write the pages.
  - `_config.yml`, `serve.json` (`{"cleanUrls": false}`): config for GitHub Pages and local preview.
  - `FLOWS.md.tmp`: QA checklist. Not for the repo.
- No project HTML pages exist yet. Nothing has been committed or pushed.

## Existing cards on index.html (in order)

1. CCIM: Quantitative OT Change Management (MSc Dissertation)
2. FAT16 File System Reconstruction
3. Network Intrusion Detection System (NIDS)
4. Risk Management via Monte Carlo Simulation
5. AI Workflow Automation: n8n and Ollama (no supporting material, so keep it as a card only)
6. Embedded Firmware: 1-Wire Sensor Emulation
7. SOC Implementation (BSc Thesis)
8. Software Engineering: Java Web Application (this is actually MuniciPath)
9. Java Console Game: Vector Rally Race Simulator
10. Software Engineering: C# SOAP Web Application (no supporting material, so keep it as a card only)

Relevant_Material folders: `CCIM - MSc`, `Embedded Systems`, `FAT16 reconstruction`, `Java 1 - Vector Rally`, `Java 2 - SpringBoot - SW Engineering`, `Law`, `NIDS`, `Pentest`, `Risk Management`, `Security Operations Centre - BSc`.

## Task list

1. [ ] Unzip the work-in-progress files into the repo root.
2. [ ] Fix the image problems (see "Image caveats").
3. [ ] Write the content for each page: overview, my role, key decisions and why, how it works, results, limitations and what I would do next, gallery, links. Use the facts below and check them against the reports.
4. [ ] Create pages (slugs): `ccim`, `fat16`, `nids`, `risk-monte-carlo`, `embedded-1wire`, `soc`, `municipath`, `vector-rally`, `pentest`, `synnovis`, `booking-api`.
5. [ ] Update `index.html`: make cards link to `projects/<slug>.html`, add cards for Pentest, Synnovis legal analysis and the C# booking API, and fix the three wording errors below.
6. [ ] Test on desktop and mobile (layout, links, lightbox, image loading, contrast).
7. [ ] Decide what to do with `Relevant_Material` (see "Privacy and repo hygiene").
8. [ ] Commit (keep me as the author). Do not push without asking me first.

## Wording to correct on index.html

- Java 2 is a **group project** called **MuniciPath** (Spring Boot and Angular, JWT, Wilson score analytics).
- The SOC was validated with an **EICAR / VirusTotal test**, not a "multicloud attack simulation".
- The embedded scratchpad stores values **multiplied by 10 as integers (one decimal place)**, not "two-decimal fixed point".

## Image caveats

- `img/projects/embedded-1wire/wiring.webp` is the wrong image. It shows the DHT22 internal "Working Principle" figure. Replace it with the real wiring diagram (with the 10 kΩ pull-up) and the pinout figure from the Embedded Systems report.
- `img/projects/pentest/osint-hint.webp` and `privilege-escalation.webp` may show lab hints, flags or credentials. Check them, and leave them out if in doubt. `host-discovery.webp` is safe.

Image inventory:
- ccim: asds-distribution, cs1a-wan-pmu, cs1b-interlock, cs2-ai-dosing, formalisation-model, pert-variables, roc-curve, standards-interaction, t-distribution
- embedded-1wire: dht22-timing, flowchart-solution, protocol-comparison, wiring (wrong), wokwi-editor, wokwi-run
- nids: class-diagram, secure-logging, sequence-diagram
- pentest: host-discovery, meterpreter-session, osint-hint (check), privilege-escalation (check), service-scan
- risk-monte-carlo: lec-per-risk, lec-total, quarterly-events, quarterly-loss
- soc: final-topology, hp-proliant, initial-topology, snort-dashboard, wazuh-log-ingestion
- vector-rally: track-idea, track-render

## Privacy and repo hygiene

- `Relevant_Material` (about 31 MB of raw reports) is in the **public** repo, and 30 of its files are already tracked by git. Decide whether to remove it from the repo (and possibly from history) once the pages are built.

## Key facts per project (verify against reports)

- **CCIM (MSc):** AHP weights 0.467 / 0.277 / 0.160 / 0.095, consistency ratio 0.011. Corpus of 22 scenarios (15 unacceptable, 7 acceptable). PERT with λ = 4. Monte Carlo with N = 10,000 per class. Threshold τ ≈ 0.277, AUC ≈ 0.993, Youden J ≈ 0.915. Case study CS1a: T_N = 0.5158 > τ_N ≈ 0.286; manufacturing T_M = 0.5517 > τ_M ≈ 0.318. CS1b interlock: T = 0.092 and 0.1127, both below τ. CS2 covers AI dosing. Structured around NIS2 and how standards interact.
- **FAT16 forensics:** 2048-byte clusters. Root directory wiped by a quick format. FAT1 checked against FAT2. Recovered 57 files, 8 directories and 16 sub-directories. Key evidence: INVOICE.PDF and TRANSA-1.TXT (matching wallet). MD5 of the image verified for integrity.
- **NIDS (Python):** Scapy sniffer, traffic tracker, threshold detection with cooldown. Mutual CHAP, AES-256, HMAC, CRC and timestamps. Secure HMAC-protected logs plus `check_logs.py` for verification. Limitations: static thresholds, hardcoded key.
- **Risk Management:** Poisson frequency × lognormal severity, 10,000 trials, IALE, loss exceedance curves (per risk and total), quarterly events and losses.
- **Embedded 1-Wire emulation:** Arduino reads DHT22 and exposes values through a virtual 1-Wire scratchpad. Timer1 in CTC mode, prescaler 64, OCR1A = 249 (1 ms tick). 50 ms conversion time. Checksum verification. Register-level I/O. Simulated in Wokwi.
- **SOC (BSc thesis):** Wazuh, pfSense, Snort, Proxmox, ESXi on HP ProLiant hardware. Custom decoders for Kea-DHCP4 and the pfSense Captive Portal. Validated with an EICAR / VirusTotal test. Hardware cost about €150. Limitations: no SOAR, free VirusTotal API quota.
- **MuniciPath (group project):** Spring Boot + Angular, JWT auth, Wilson score analytics. Be clear about which parts were mine.
- **Vector Rally (Java/Gradle):** console race game with configurable tracks and bot racers. Local repo source has the details.
- **Pentest lab (12 Dec 2025):** 5 VMs covering OSINT, buffer overflow, command injection, SQL injection, and phishing plus privilege escalation.
- **Synnovis legal analysis (Law):** UK GDPR Articles 32 and 28, the Advanced £3.07m fine as precedent, Computer Misuse Act 1990.
- **C# booking API (.NET 8):** EF Core with SQL Server, FluentValidation for booking overlap checks, JWT (HMAC-SHA256, 30-minute expiry), paginated availability, Swagger. Known weakness: passwords compared in plain text, so present it honestly as a limitation or fix it.

## Deployment notes

- Preview the site before committing. Commit with me as author and add the trailer `Co-authored-by: Perplexity <noreply@perplexity.ai>`.
- Ask before pushing to GitHub.

## Suggested skills

- `website-building`: for building and editing the pages, design consistency, QA and preview deployment.
- `office`: for reading the PDF reports in `Relevant_Material` and extracting text and images.
- `browser-use`: for visual checks of the rendered pages on desktop and mobile widths.
