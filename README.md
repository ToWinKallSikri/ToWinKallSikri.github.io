# Twinkal Sikri's Portfolio

The portfolio is a static site hosted with GitHub Pages. Project case studies are generated as standalone HTML pages from `content/projects.json`.

The portfolio is currently available in English. Italian translations have not yet been added.

To rebuild the case studies after editing their content:

```sh
node tools/build-projects.mjs
```

Project images are stored under `img/projects/`. The gallery opens images in a keyboard-accessible lightbox, with the original image still available as a link.
