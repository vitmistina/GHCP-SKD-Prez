# GHCP SDK presentation

Canonical source for Vít Miština’s illustrated 3D presentation, **Climbing the delegation staircase**.

## Open and edit

- Download `dist/presentation.html` and open it directly in a browser. It includes the JavaScript, fonts and historical photograph and needs no network connection.
- For development, run `python3 -m http.server 8080 --directory dist`, then open `http://localhost:8080`.
- Edit `dist/app.js` for slide copy, speaker notes, 3D models and interaction. Edit `dist/style.css` for layout and `dist/index.html` for the shell.
- Run `python3 build-single.py` after edits to regenerate the standalone HTML. Commit both the editable source and regenerated HTML.
- JavaScript syntax check: `node --input-type=module --check < dist/app.js`.

## Controls

Arrow keys / Space: navigate. M: chapter map. N: speaker notes. F: full screen. Drag the illustration to rotate it.

The introduction has a slow continuous escalator with a pause button. ENIAC is projected on a cinema screen with animated reels and a pause control. Reduced-motion preferences disable these animations. WebGL rendering uses Three.js; a Canvas 2D projection of the same scene is available when WebGL is unavailable.

The MAF workflow is an illustrative simulation, not a live integration. The practical-findings slide is a draft for the presenter’s observations.

## Assets

`dist/assets/eniac.jpeg` is the unchanged historical photograph extracted from the previous `copilot-sdk-story-v2-visual.pptx`. Its recorded source is [The Army at 250: Did you know the Army invented this?](https://www.army.mil/article/283485/the_army_at_250_did_you_know_the_army_invented_this). It is displayed at its original aspect ratio.

Three.js 0.170.0 is vendored in `dist/three.module.js`. Caveat and DM Sans fonts are bundled locally. The standalone HTML embeds these dependencies, including the ENIAC photo.

## Software crisis scene

The animated **Software Crisis (1968)** slide sits immediately after FORTRAN and before the iceberg. Its growing, interconnected paper city illustrates the mismatch between new computing capability and the methods used to manage larger software. Pause growth or replay it from its controls. The tiny engineer deliberately does not scale with the skyline. Reduced-motion settings present a stable finished city.

The on-slide quotation is an exact excerpt from Edsger W. Dijkstra, [*The Humble Programmer* (1972)](https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/!SV-EWD340.html). The crisis was discussed at the 1968 NATO conference; Dijkstra's quotation is from **1972**, not 1968. The scene is a metaphor, not a historical simulation or a claim that AI has already caused another crisis.

## Apollo loop

The Apollo scene follows the circular sketch: spacecraft → mission control → crew → DSKY / AGC → spacecraft. Four sequential, visibly different packets carry telemetry, instructions, verb/noun input and control. Pause or advance the signal with the on-slide controls; reduced motion shows stationary packets. The CSM and astronaut are deliberately simplified low-poly models. This is a pedagogical analogy, not a literal flight-control sequence: DSKY is the interface to the AGC, and decisions were distributed.

The photograph of Margaret Hamilton beside her team's Apollo flight software listings (1969) is bundled in `dist/assets/hamilton.jpeg`, from [NASA Science](https://science.nasa.gov/people/margaret-hamilton/). The adjacent procedure card is an illustrative checklist, not an archival flight-plan image. `/scripts` and `skill.md` are contemporary analogies. Both the photo and the scene are embedded in the standalone HTML.
