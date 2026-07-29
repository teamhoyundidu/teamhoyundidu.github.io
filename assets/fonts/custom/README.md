# Custom fonts

Drop your own font files (`.woff2` preferred, `.ttf`/`.otf` also fine) directly into
this folder via the GitHub web UI ("Add file" → "Upload files").

Then open `assets/css/custom-fonts.css` and fill in the matching `@font-face` block
with your filename. That's the only edit needed — `assets/css/style.css` already
prefers these custom fonts over the defaults, so nothing else has to change.

See `assets/css/custom-fonts.css` for the exact steps and the three reserved slots
(script / body serif / display).
