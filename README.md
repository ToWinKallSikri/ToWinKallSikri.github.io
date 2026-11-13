# Twinkal Sikri's Portfolio

The portfolio is a static site hosted with GitHub Pages. Project case studies are generated as standalone HTML pages from `content/projects.json`.

To build or rebuild the English and Italian portfolio pages after editing their content:

```sh
node tools/build-projects.mjs
```

The English portfolio is at `index.html`; the Italian version is at `it/index.html`. Project case studies are generated in `projects/` and `it/projects/`. Their English content is in `content/projects.json`, Italian translations are in `content/projects.it.json`, and the Italian homepage translations are in `content/home.it.json`.

Project images are stored under `img/projects/`. The gallery opens images in a keyboard-accessible lightbox, with the original image still available as a link.
