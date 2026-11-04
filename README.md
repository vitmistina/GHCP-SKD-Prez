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

## Dithering / postprocessing

Open **Effects** at the lower right, or press **Shift+D**. **D** toggles the effect; **Esc** closes the panel. It starts disabled and remembers settings in local browser storage when available. Reset restores the disabled default. Show original temporarily bypasses the effect without losing settings.

The panel controls raster cell size (1–16 CSS pixels), Bayer 2×2 / 4×4 / 8×8 or deterministic static noise, strength, effect mix, contrast and brightness. Choose Ink & paper, Game Boy, Sepia archive, Green phosphor, Sunset print, Pastel paper or CGA cyan/magenta. These palettes map luminance to their ordered colors. RGB and grayscale modes offer 1–8 **total bits per pixel** (2–256 colors); RGB uses grayscale at 1–2 bits and distributes higher bit depths across channels, up to RGB 3/3/2 at 8 bits. At 100% mix the filtered image uses only the selected palette; blending with the original introduces intermediate colors. Raster size controls threshold cells, not the resolution of the original image.

Apply the filter to the entire slide (including live 3D, photographs and text) or just the 3D illustration. The floating controls remain outside the effect. SVG compositing performs the postprocessing directly on the live page, so animations and pointer interaction continue without screenshots or a second animation loop. Disabling removes the filter entirely. The chapter-map modal uses the browser's top layer and remains unfiltered. Printing omits the panel and effect.

Source: `dist/dithering.js`, initialized after the renderer. `build-single.py` embeds it into the offline HTML. Tested in desktop Chrome, including mobile viewport layout; full-slide filter performance depends on browser, viewport size and GPU.

The introduction has a slow continuous escalator with a pause button. ENIAC is projected on a cinema screen with animated reels and a pause control. Reduced-motion preferences disable these animations. WebGL rendering uses Three.js; a Canvas 2D projection of the same scene is available when WebGL is unavailable.

The MAF workflow is an illustrative simulation, not a live integration. The interactive field-notes slide replaces the former practical-findings placeholder. It contains five presenter-controlled miniature 3D scenes: manual context migration; explicit subagent roles; Copilot helping to build its own SDK workflow; heartbeat versus real progress; and the coordination bottleneck created by too many agents. On this slide, the arrow keys and footer arrows step through the five lessons before moving to the next slide. This is a qualitative illustration, not a benchmark. The notes panel (N) contains presenter context for each lesson.

## Assets

`dist/assets/eniac.jpeg` is the unchanged historical photograph extracted from the previous `copilot-sdk-story-v2-visual.pptx`. Its recorded source is [The Army at 250: Did you know the Army invented this?](https://www.army.mil/article/283485/the_army_at_250_did_you_know_the_army_invented_this). It is displayed at its original aspect ratio.

Three.js 0.170.0 is vendored in `dist/three.module.js`. Caveat and DM Sans fonts are bundled locally. The standalone HTML embeds these dependencies, including the ENIAC photo.

## Software crisis scene

The animated **Software Crisis (1968)** slide sits immediately after FORTRAN and before the iceberg. Its growing, interconnected paper city illustrates the mismatch between new computing capability and the methods used to manage larger software. Pause growth or replay it from its controls. The tiny engineer deliberately does not scale with the skyline. Reduced-motion settings present a stable finished city.

The on-slide quotation is an exact excerpt from Edsger W. Dijkstra, [*The Humble Programmer* (1972)](https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/!SV-EWD340.html). The crisis was discussed at the 1968 NATO conference; Dijkstra's quotation is from **1972**, not 1968. The scene is a metaphor, not a historical simulation or a claim that AI has already caused another crisis.

## Apollo loop

The Apollo scene follows the circular sketch: spacecraft → mission control → crew → DSKY / AGC → spacecraft. Four sequential, visibly different packets carry telemetry, instructions, verb/noun input and control. Pause or advance the signal with the on-slide controls; reduced motion shows stationary packets. The CSM and astronaut are deliberately simplified low-poly models. This is a pedagogical analogy, not a literal flight-control sequence: DSKY is the interface to the AGC, and decisions were distributed.

The photograph of Margaret Hamilton beside her team's Apollo flight software listings (1969) is bundled in `dist/assets/hamilton.jpeg`, from [NASA Science](https://science.nasa.gov/people/margaret-hamilton/). The adjacent procedure card is an illustrative checklist, not an archival flight-plan image. `/scripts` and `skill.md` are contemporary analogies. Both the photo and the scene are embedded in the standalone HTML.

## Standalone HTML build

The editable web version lives in `dist/index.html` plus `dist/app.js` and `dist/style.css`. An Actions workflow, `.github/workflows/build-standalone.yml`, runs `python3 build-single.py` when these files change and commits an updated `dist/presentation.html` on `main`. It also supports manual dispatch. If Actions are disabled, run the build locally before sharing the offline export.

## Two bridges to the closing prediction

Immediately after the five hands-on lessons, the presentation now has two animated low-poly scenes.

**SDK alternatives: "The SDK did not invent the loop."** Three lanes show a hand-built LLM/tool loop, scripted non-interactive Copilot CLI, and packaged coding-agent SDKs (Copilot, Claude and Codex). Click each lane's button to focus its engineering trade-off; pause the animated signals if helpful. This compares architectural approaches, not product parity or performance. Reference documentation: [Copilot SDK](https://github.com/github/copilot-sdk), [CLI automation](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically), [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview), [Codex SDK](https://developers.openai.com/codex/sdk/).

**Deterministic limits, stochastic work.** A precise state machine and enforceable rule-count, budget and retry limits face an exploratory agent landscape, connected through a policy gate. Toggle "Within limits" versus "Over budget" to see an allowed proposal or a rejected one. The host can bound tool calls, budgets and state transitions, but admission by policy is not proof of the agent's answer being correct. This is an illustrative simulation, not a live SDK demo.

## Closing Wardley-inspired 3D map

The final slide, after the five field notes, uses Three.js low-poly models on a physical four-column Wardley-inspired map. It shows the compiler and managed-memory evolution, a custom harness, the **software factory in Genesis today**, and a **red dashed prediction** toward a few mainstream products (not automatically commodities).

It plays its four beats automatically, with pause, replay and next-beat controls. Reduced-motion settings show the complete map. Source: `dist/wardley-scene.js`, included by `dist/app.js`. The standalone export builder also inlines this scene so `dist/presentation.html` continues to work offline.
