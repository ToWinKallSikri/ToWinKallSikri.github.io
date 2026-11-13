import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(readFileSync(resolve(root, 'content/projects.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
const paragraphs = values => values.map(value => `<p>${escape(value)}</p>`).join('\n');
const list = values => `<ul>${values.map(value => `<li>${escape(value)}</li>`).join('\n')}</ul>`;

if (new Set(projects.map(project => project.slug)).size !== projects.length) {
  throw new Error('Project slugs must be unique.');
}

mkdirSync(resolve(root, 'projects'), { recursive: true });

for (const [position, project] of projects.entries()) {
  const previous = projects[(position - 1 + projects.length) % projects.length];
  const next = projects[(position + 1) % projects.length];
  const section = (id, title, body) => `<section class="case-section" id="${id}"><h2>${title}</h2><div>${body}</div></section>`;
  const gallery = project.images?.length ? `<section class="case-gallery-section" id="gallery">
    <h2>Project images</h2>
    <p class="case-gallery-note">Select an image to view it at a larger size.</p>
    <div class="case-gallery">${project.images.map(image => {
      const path = `img/projects/${project.slug}/${image.file}`;
      if (!existsSync(resolve(root, path))) throw new Error(`Missing image: ${path}`);
      return `<figure class="case-figure">
        <a class="case-image-link" href="../${path}" data-title="${escape(image.title)}" aria-label="Enlarge: ${escape(image.title)}">
          <img src="../${path}" alt="${escape(image.alt)}" loading="lazy" decoding="async">
        </a>
        <figcaption><strong>${escape(image.title)}</strong>${escape(image.caption)}</figcaption>
      </figure>`;
    }).join('\n')}</div></section>` : '';
  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(project.deck)}">
  <meta name="author" content="Twinkal Sikri">
  <meta property="og:title" content="${escape(project.title)} | Twinkal Sikri">
  <meta property="og:description" content="${escape(project.deck)}">
  <meta property="og:type" content="article">
  <link rel="icon" type="image/png" href="../img/favicon-32x32.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&amp;family=Source+Sans+3:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
  <link href="../css/resume.css" rel="stylesheet">
  <link href="../css/project.css" rel="stylesheet">
  <title>${escape(project.title)} | Twinkal Sikri</title>
</head>
<body class="case-study" id="page-top">
  <a class="skip-link" href="#main">Skip to case study</a>
  <nav class="case-nav" aria-label="Main navigation">
    <a class="case-brand" href="../index.html#about">Twinkal Sikri</a>
    <a href="../index.html#projects">All projects</a>
    <a href="mailto:twinxvii@gmail.com">Contact</a>
  </nav>
  <main class="case-main" id="main">
    <a class="case-back" href="../index.html#projects">&larr; Back to projects</a>
    <article>
      <header class="case-header">
        <p class="eyebrow">${escape(project.category)}</p>
        <h1>${escape(project.title)}</h1>
        <p class="case-deck">${escape(project.deck)}</p>
        <dl class="case-meta">
          <div><dt>Context</dt><dd>${escape(project.context)}</dd></div>
          <div><dt>My role</dt><dd>${escape(project.role)}</dd></div>
          ${project.period ? `<div><dt>Period</dt><dd>${escape(project.period)}</dd></div>` : ''}
        </dl>
      </header>
      <nav class="case-jump" aria-label="Case study sections">
        <a href="#overview">Overview</a><a href="#contribution">My contribution</a>
        <a href="#how-it-works">How it works</a><a href="#decisions">Key decisions</a>
        <a href="#results">Results</a><a href="#limitations">Limits and next steps</a>
        ${gallery ? '<a href="#gallery">Images</a>' : ''}
      </nav>
      ${section('overview', 'Overview', paragraphs(project.overview))}
      ${section('contribution', 'My contribution', list(project.contribution))}
      ${section('how-it-works', 'How it works', paragraphs(project.howItWorks))}
      ${section('decisions', 'Key decisions', project.decisions.map(decision => `<div class="decision"><h3>${escape(decision.title)}</h3><p><span class="decision-label">Choice:</span> ${escape(decision.choice)}</p><p><span class="decision-label">Why:</span> ${escape(decision.why)}</p><p><span class="decision-label">Trade-off:</span> ${escape(decision.tradeoff)}</p></div>`).join('\n'))}
      ${section('results', 'Results', paragraphs(project.results))}
      ${section('limitations', 'Limits and next steps', paragraphs(project.limitations))}
      ${gallery}
      <section class="case-section" id="tools"><h2>Tools and methods</h2><ul class="tag-list">${project.tags.map(tag => `<li>${escape(tag)}</li>`).join('')}</ul></section>
      <div class="case-source"><p>${escape(project.evidence)}</p>${project.repository ? `<p><a href="${escape(project.repository)}" target="_blank" rel="noopener noreferrer">View the project on GitHub <span class="sr-only">(opens in a new tab)</span></a></p>` : ''}</div>
    </article>
    <nav class="case-pagination" aria-label="More projects">
      <a href="${previous.slug}.html"><span>Previous project</span>${escape(previous.title)}</a>
      <a href="${next.slug}.html"><span>Next project</span>${escape(next.title)}</a>
    </nav>
    <footer class="case-footer"><a href="../index.html#projects">All projects</a><span>Twinkal Sikri</span><a href="mailto:twinxvii@gmail.com">Get in touch</a></footer>
  </main>
  ${gallery ? '<dialog class="image-dialog" aria-labelledby="image-title"><div class="image-dialog-bar"><p id="image-title"></p><button type="button" autofocus>Close image</button></div><img alt=""><a class="original-image" target="_blank" rel="noopener noreferrer">Open image in a new tab</a></dialog>' : ''}
  <script src="../js/project.js"></script>
</body>
</html>`;
  writeFileSync(resolve(root, `projects/${project.slug}.html`), html + '\n');
}

console.log(`Built ${projects.length} static case studies.`);
