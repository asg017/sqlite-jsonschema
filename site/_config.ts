import lume from "lume/mod.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import javascript from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/javascript.min.js";
import python from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/python.min.js";

import anchor from "npm:markdown-it-anchor";
import sql from "./_sql.ts";
const site = lume(
  {
    prettyUrls: false,
    //location: new URL("https://alexgarcia.xyz/sqlite-jsonschema"),
  },
  {
    markdown: {
      plugins: [[anchor, { level: 2 }]],
      keepDefaultPlugins: true,
    },
  }
);

site.data("VERSION", "v" + Deno.readTextFileSync("../VERSION"));
site.data("project", "sqlite-jsonschema");

site.use(
  codeHighlight({
    languages: {
      sql,
      javascript,
      python,
    },
  })
);

site.copy("static/pico.min.css");
site.copy("static/script.js");
site.copy("static/style.css");
site.copy("static/github-mark.svg");
site.copy("static/github-mark-white.svg");

export default site;
