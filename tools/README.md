# Pumas build tools

Used by Claude after each game (on the "full time" signal):

1. Export the match tracker data (matches/, events/ JSON) to a folder, e.g. `trk/`.
2. Results video: `python3 tools/results-video/build_data.py trk res.js` → feeds the Motion full-time film.
3. Website: `python3 tools/site/build_site.py trk tools/site/index.template.html index.html`, then commit and push `index.html`.

## Stand-in scorer (another parent)
`scorer.html` (https://danbrown51.github.io/Pumas/scorer.html) is a copy of the tracker that saves on the parent's phone only.
At full time they tap "Send to Dan", which sends a WhatsApp message ending in a `PUMAS-DATA {...}` line.
Import: save the message to a file, `python3 tools/scorer_import.py msg.txt writes.json`, then write those docs to the tracker db (ArtifactData batch), then run the normal full-time routine.
