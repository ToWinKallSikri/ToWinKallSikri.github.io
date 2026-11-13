# Twinkal Sikri's Portfolio

The portfolio is a static site hosted with GitHub Pages. Project case studies are generated as standalone HTML pages from `content/projects.json`.

The “Italiano” navigation link opens the current page through Google Translate, including project case studies. Translation requires an internet connection and is provided by Google Translate.

To rebuild the case studies after editing their content:

```sh
node tools/build-projects.mjs
```

Project images are stored under `img/projects/`. The gallery opens images in a keyboard-accessible lightbox, with the original image still available as a link.
