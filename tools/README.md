# Pumas build tools

Used by Claude after each game (on the "full time" signal):

1. Export the match tracker data (matches/, events/ JSON) to a folder, e.g. `trk/`.
2. Results video: `python3 tools/results-video/build_data.py trk res.js` → feeds the Motion full-time film.
3. Website: `python3 tools/site/build_site.py trk tools/site/index.template.html index.html`, then commit and push `index.html`.
