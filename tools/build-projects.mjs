import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(readFileSync(resolve(root, 'content/projects.json'), 'utf8'));
const italianProjects = JSON.parse(readFileSync(resolve(root, 'content/projects.it.json'), 'utf8'));
const italianHome = JSON.parse(readFileSync(resolve(root, 'content/home.it.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
const paragraphs = values => values.map(value => `<p>${escape(value)}</p>`).join('\n');
const list = values => `<ul>${values.map(value => `<li>${escape(value)}</li>`).join('\n')}</ul>`;

if (new Set(projects.map(project => project.slug)).size !== projects.length) {
  throw new Error('Project slugs must be unique.');
}

for (const project of projects) {
  const translation = italianProjects[project.slug];
  if (!translation) throw new Error(`Missing Italian project translation: ${project.slug}`);
  for (const field of ['title', 'category', 'context', 'role', 'deck', 'overview', 'contribution', 'decisions', 'howItWorks', 'results', 'limitations', 'tags', 'evidence']) {
    if (translation[field] === undefined) throw new Error(`Missing Italian "${field}" for ${project.slug}.`);
  }
  if ((translation.images?.length || 0) !== (project.images?.length || 0)) {
    throw new Error(`Italian image count does not match ${project.slug}.`);
  }
  if (translation.decisions.length !== project.decisions.length) {
    throw new Error(`Italian decision count does not match ${project.slug}.`);
  }
}

const labels = {
  en: {
    skip: 'Skip to case study', navigation: 'Main navigation', languages: 'Language versions',
    allProjects: 'All projects', contact: 'Contact', back: 'Back to projects',
    context: 'Context', role: 'My role', period: 'Period',
    sections: 'Case study sections', overview: 'Overview', contribution: 'My contribution',
    how: 'How it works', decisions: 'Key decisions', results: 'Results',
    limitations: 'Limits and next steps', images: 'Images', gallery: 'Project images',
    galleryNote: 'Select an image to view it at a larger size.', tools: 'Tools and methods',
    choice: 'Choice:', why: 'Why:', tradeoff: 'Trade-off:',
    previous: 'Previous project', next: 'Next project', getInTouch: 'Get in touch',
    repo: 'View the project on GitHub', newTab: '(opens in a new tab)',
    enlarge: 'Enlarge:', closeImage: 'Close image', openImage: 'Open image in a new tab'
  },
  it: {
    skip: 'Vai al caso studio', navigation: 'Navigazione principale', languages: 'Versioni linguistiche',
    allProjects: 'Tutti i progetti', contact: 'Contatti', back: 'Torna ai progetti',
    context: 'Contesto', role: 'Ruolo', period: 'Periodo',
    sections: 'Sezioni del caso studio', overview: 'Panoramica', contribution: 'Il mio contributo',
    how: 'Come funziona', decisions: 'Decisioni chiave', results: 'Risultati',
    limitations: 'Limiti e sviluppi futuri', images: 'Immagini', gallery: 'Immagini del progetto',
    galleryNote: 'Seleziona un’immagine per ingrandirla.', tools: 'Strumenti e metodi',
    choice: 'Scelta:', why: 'Motivazione:', tradeoff: 'Compromesso:',
    previous: 'Progetto precedente', next: 'Progetto successivo', getInTouch: 'Contattami',
    repo: 'Visualizza il progetto su GitHub', newTab: '(si apre in una nuova scheda)',
    enlarge: 'Ingrandisci:', closeImage: 'Chiudi immagine', openImage: 'Apri l’immagine in una nuova scheda'
  }
};

function renderProject(project, previous, next, language) {
  const isItalian = language === 'it';
  const translation = isItalian ? italianProjects[project.slug] : project;
  const languageNames = isItalian ? { english: 'Inglese', italian: 'Italiano' } : { english: 'English', italian: 'Italiano' };
  const content = isItalian ? {
    ...project,
    ...translation,
    images: (translation.images || []).map((image, index) => ({
      ...project.images[index],
      ...image,
      file: project.images[index].file
    }))
  } : project;
  const text = labels[language];
  const assetPrefix = isItalian ? '../../' : '../';
  const italianUrl = isItalian ? `${project.slug}.html` : `../it/projects/${project.slug}.html`;
  const section = (id, title, body) => `<section class="case-section" id="${id}"><h2>${escape(title)}</h2><div>${body}</div></section>`;
  const gallery = content.images?.length ? `<section class="case-gallery-section" id="gallery">
    <h2>${escape(text.gallery)}</h2>
    <p class="case-gallery-note">${escape(text.galleryNote)}</p>
    <div class="case-gallery">${content.images.map(image => {
      const path = `img/projects/${project.slug}/${image.file}`;
      if (!existsSync(resolve(root, path))) throw new Error(`Missing image: ${path}`);
      return `<figure class="case-figure">
        <a class="case-image-link" href="${assetPrefix}${path}" data-title="${escape(image.title)}" aria-label="${escape(text.enlarge)} ${escape(image.title)}">
          <img src="${assetPrefix}${path}" alt="${escape(image.alt)}" loading="lazy" decoding="async">
        </a>
        <figcaption><strong>${escape(image.title)}</strong>${escape(image.caption)}</figcaption>
      </figure>`;
    }).join('\n')}</div></section>` : '';
  const html = `<!DOCTYPE html>
<html lang="${isItalian ? 'it-IT' : 'en-GB'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(content.deck)}">
  <meta name="author" content="Twinkal Sikri">
  <meta property="og:title" content="${escape(content.title)} | Twinkal Sikri">
  <meta property="og:description" content="${escape(content.deck)}">
  <meta property="og:type" content="article">
  <link rel="icon" type="image/png" href="${assetPrefix}img/favicon-32x32.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&amp;family=Source+Sans+3:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
  <link href="${assetPrefix}css/resume.css" rel="stylesheet">
  <link href="${assetPrefix}css/project.css" rel="stylesheet">
  <title>${escape(content.title)} | Twinkal Sikri</title>
</head>
<body class="case-study" id="page-top">
  <a class="skip-link" href="#main">${escape(text.skip)}</a>
  <nav class="case-nav" aria-label="${escape(text.navigation)}">
    <a class="case-brand" href="../index.html#about">Twinkal Sikri</a>
    <a href="../index.html#projects">${escape(text.allProjects)}</a>
    <a href="mailto:twinxvii@gmail.com">${escape(text.contact)}</a>
    <div class="language-nav" role="group" aria-label="${escape(text.languages)}">
      <a href="${isItalian ? `../../projects/${project.slug}.html` : `../projects/${project.slug}.html`}" lang="en-GB" aria-label="${languageNames.english}" title="${languageNames.english}"><img src="${assetPrefix}img/flags/gb.svg" alt=""></a>
      <a href="${italianUrl}" lang="it" aria-label="${languageNames.italian}" title="${languageNames.italian}"><img src="${assetPrefix}img/flags/it.svg" alt=""></a>
    </div>
  </nav>
  <main class="case-main" id="main">
    <a class="case-back" href="../index.html#projects">&larr; ${escape(text.back)}</a>
    <article>
      <header class="case-header">
        <p class="eyebrow">${escape(content.category)}</p>
        <h1>${escape(content.title)}</h1>
        <p class="case-deck">${escape(content.deck)}</p>
        <dl class="case-meta">
          <div><dt>${escape(text.context)}</dt><dd>${escape(content.context)}</dd></div>
          <div><dt>${escape(text.role)}</dt><dd>${escape(content.role)}</dd></div>
          ${content.period ? `<div><dt>${escape(text.period)}</dt><dd>${escape(content.period)}</dd></div>` : ''}
        </dl>
      </header>
      <nav class="case-jump" aria-label="${escape(text.sections)}">
        <a href="#overview">${escape(text.overview)}</a><a href="#contribution">${escape(text.contribution)}</a>
        <a href="#how-it-works">${escape(text.how)}</a><a href="#decisions">${escape(text.decisions)}</a>
        <a href="#results">${escape(text.results)}</a><a href="#limitations">${escape(text.limitations)}</a>
        ${gallery ? `<a href="#gallery">${escape(text.images)}</a>` : ''}
      </nav>
      ${section('overview', text.overview, paragraphs(content.overview))}
      ${section('contribution', text.contribution, list(content.contribution))}
      ${section('how-it-works', text.how, paragraphs(content.howItWorks))}
      ${section('decisions', text.decisions, content.decisions.map(decision => `<div class="decision"><h3>${escape(decision.title)}</h3><p><span class="decision-label">${escape(text.choice)}</span> ${escape(decision.choice)}</p><p><span class="decision-label">${escape(text.why)}</span> ${escape(decision.why)}</p><p><span class="decision-label">${escape(text.tradeoff)}</span> ${escape(decision.tradeoff)}</p></div>`).join('\n'))}
      ${section('results', text.results, paragraphs(content.results))}
      ${section('limitations', text.limitations, paragraphs(content.limitations))}
      ${gallery}
      <section class="case-section" id="tools"><h2>${escape(text.tools)}</h2><ul class="tag-list">${content.tags.map(tag => `<li>${escape(tag)}</li>`).join('')}</ul></section>
      <div class="case-source"><p>${escape(content.evidence)}</p>${content.repository ? `<p><a href="${escape(content.repository)}" target="_blank" rel="noopener noreferrer">${escape(content.repositoryLabel || text.repo)} <span class="sr-only">${escape(text.newTab)}</span></a></p>` : ''}</div>
    </article>
    <nav class="case-pagination" aria-label="${escape(text.allProjects)}">
      <a href="${previous.slug}.html"><span>${escape(text.previous)}</span>${escape(isItalian ? italianProjects[previous.slug].title : previous.title)}</a>
      <a href="${next.slug}.html"><span>${escape(text.next)}</span>${escape(isItalian ? italianProjects[next.slug].title : next.title)}</a>
    </nav>
    <footer class="case-footer"><a href="../index.html#projects">${escape(text.allProjects)}</a><span>Twinkal Sikri</span><a href="mailto:twinxvii@gmail.com">${escape(text.getInTouch)}</a></footer>
  </main>
  ${gallery ? `<dialog class="image-dialog" aria-labelledby="image-title"><div class="image-dialog-bar"><p id="image-title"></p><button type="button" autofocus>${escape(text.closeImage)}</button></div><img alt=""><a class="original-image" target="_blank" rel="noopener noreferrer">${escape(text.openImage)}</a></dialog>` : ''}
  <script src="${assetPrefix}js/project.js"></script>
</body>
</html>`;
  return html + '\n';
}

function translateHome() {
  const source = readFileSync(resolve(root, 'index.html'), 'utf8');
  const textTranslations = italianHome.text || {};
  const attributeTranslations = italianHome.attributes || {};
  const decode = value => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  let html = source.replace('<html lang="en">', '<html lang="it-IT">');
  html = html.replace(/>([^<]+)(?=<)/g, (match, content) => {
    const leading = content.match(/^\s*/)[0];
    const trailing = content.match(/\s*$/)[0];
    const key = decode(content.slice(leading.length, content.length - trailing.length));
    if (textTranslations[key] === undefined) return match;
    return `>${leading}${escape(textTranslations[key])}${trailing}`;
  });
  html = html.replace(/\b(alt|aria-label|title|content)="([^"]*)"/g, (match, attribute, value) => {
    const translated = attributeTranslations[decode(value)];
    return translated === undefined ? match : `${attribute}="${escape(translated)}"`;
  });
  html = html.replace(/<div class="language-nav"[\s\S]*?<\/div>/, `<div class="language-nav" role="group" aria-label="Versioni linguistiche">
        <a href="../index.html" lang="en-GB" aria-label="Inglese" title="Inglese"><img src="../img/flags/gb.svg" alt=""></a>
        <a href="index.html" lang="it" aria-current="page" aria-label="Italiano" title="Italiano"><img src="../img/flags/it.svg" alt=""></a>
      </div>`);
  html = html.replace(/\b(src|href)="(img\/|vendor\/|css\/|js\/|Twinkal_Sikri_[^"]*)/g, '$1="../$2');
  html = html.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")(img\/)/g, '$1../$2');
  html = html.replace('</title>', '</title>\n    <link rel="alternate" hreflang="en-GB" href="../index.html">\n    <link rel="alternate" hreflang="it" href="index.html">');
  return html;
}

mkdirSync(resolve(root, 'projects'), { recursive: true });
mkdirSync(resolve(root, 'it/projects'), { recursive: true });
writeFileSync(resolve(root, 'it/index.html'), translateHome());

for (const [position, project] of projects.entries()) {
  const previous = projects[(position - 1 + projects.length) % projects.length];
  const next = projects[(position + 1) % projects.length];
  writeFileSync(resolve(root, `projects/${project.slug}.html`), renderProject(project, previous, next, 'en'));
  writeFileSync(resolve(root, `it/projects/${project.slug}.html`), renderProject(project, previous, next, 'it'));
}

console.log(`Built the Italian portfolio and ${projects.length} translated case studies.`);
