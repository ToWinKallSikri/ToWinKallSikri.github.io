(function() {
  "use strict";

  document.querySelectorAll(".language-switch").forEach(function(link) {
    var translationUrl = new URL("https://translate.google.com/translate");
    translationUrl.searchParams.set("sl", "en");
    translationUrl.searchParams.set("tl", "it");
    translationUrl.searchParams.set("u", window.location.href);
    link.href = translationUrl.toString();
  });
})();
