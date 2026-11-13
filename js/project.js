/* Progressive enhancement: image links still work when JS is unavailable. */
(() => {
  const dialog = document.querySelector('.image-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const preview = dialog.querySelector('img');
  const title = dialog.querySelector('#image-title');
  const original = dialog.querySelector('.original-image');
  let trigger;
  document.querySelectorAll('.case-image-link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      trigger = link;
      const image = link.querySelector('img');
      preview.src = link.href;
      preview.alt = image.alt;
      title.textContent = link.dataset.title;
      original.href = link.href;
      dialog.showModal();
      document.body.classList.add('image-open');
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right ||
          event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('image-open');
    if (trigger) trigger.focus({ preventScroll: true });
  });
})();
