# Build With Citysky

The homepage mounts `BuildExperience` after Approach. The dedicated route reuses
it with a longer scroll distance, followed by editorial content, completion
options and the existing WhatsApp contact integration.

## Architectural asset boundary

`architectural-model.ts` is a parametric architectural study, not a model of a
Citysky project. Its assembly, camera and finish progression are informed by the
supplied 19-second architectural reference. No production GLB is required.
`procedural-building.ts` owns perspective framing, gestures and demand rendering.
`assembly.ts` contains the reversible, origin-anchored geometry interpolation.
`BuildingViewport` imports the renderer only within 400px of the viewport.

To introduce a production model, replace the scene factory behind the dynamic
import, keeping the `BuildingScene` interface in `scene-contract.ts`:

- `setProgress(0…1)` controls the construction sequence.
- `setCompletion(null | canvas | essentials | pinnacle)` controls the finish study.
- `dispose()` releases observers, render frames, geometry, materials and context.

Keep a single optimised model with groups named site, foundation, columns, beams,
slabs, walls, roof, windows, facade, railings, compound, landscape, interiors and
lighting. The temporary adapter also uses a curation group for furniture detail.
Keep the existing viewport and scroll components independent of the asset.

## Interaction and rendering

- The six stages share a normalised progress value, with direct stage selection.
- GSAP matchMedia owns and cleans up the pin/tween on route and breakpoint changes.
- Reduced motion uses an unpinned completed study with manual stage controls.
  Short viewports retain the scrubbed assembly without pinning.
- Desktop and mobile use separate perspective lenses and camera paths. The
  scroll path turns 9–10 degrees, descends and dollies toward the completed home.
- Hover response is limited to two degrees; drag inspection is bounded to
  13 degrees either side, then returns gently. Arrow keys and Home also work.
  Mobile accepts horizontal drag while CSS pan-y preserves native vertical scroll.
- Mobile caps DPR at 1.25 and disables shadows; desktop caps DPR at 1.6.
- Repeated members share instanced geometry, each with its own assembly timing.
  Tiny procedural surface textures and instanced foliage need no asset requests.
- Rendering stops when input settles, the view is offscreen or the tab is hidden.
  Observers, pointer listeners, timers, textures, instances and WebGL resources
  are released on route changes. WebGL/import failure shows the SVG elevation.
- Completion names are local to this service. Existing project tier names and
  prices remain sourced from their existing data without modification.
- Enquiry details stay in local React state and are encoded into a WhatsApp link;
  the visitor reviews and sends the message in WhatsApp.
