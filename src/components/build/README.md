# Build With Citysky

The homepage mounts `BuildExperience` after Approach. The dedicated route reuses
it with a longer scroll distance, followed by editorial content, completion
options and the existing WhatsApp contact integration.

## Architectural asset boundary

`architectural-model.ts` is a parametric architectural study, not a model of a
Citysky project. Its assembly, camera and finish progression are informed by the
supplied 19-second architectural reference. No production GLB is required.
`procedural-building.ts` owns perspective framing, gestures and adaptive rendering.
`landscape.ts` owns the instanced garden; `scene-surfaces.ts` builds small PBR
textures and a filtered sky environment. `architectural-occlusion.ts` adds a
half-resolution desktop occlusion pass while retaining full-resolution colour.
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
- Horizontal drag allows full 360-degree inspection. The chosen orientation
  persists as an offset to the scroll camera. Elevation stays between 10 and 48
  degrees. Arrow keys rotate/tilt, +/- or Ctrl-wheel zoom within 0.9�1.22 of the
  fitted distance, and Home gently restores the default composition.
- Mobile accepts horizontal drag while CSS pan-y preserves native vertical
  scrolling. Native page pinch remains available. The hint fades after dragging.
- DPR starts at up to 2 on desktop and mobile. Mobile has fewer instanced leaves
  and grass blades, 1024px shadows and no postprocessing. Desktop has 2048px
  cached soft shadows and downsampled contact occlusion. Sustained slow rendering
  removes the occlusion pass first, then lowers DPR no further than 1.5 on a
  high-DPI screen. Real handset GPU performance should still be profiled.
- Repeated structural members, plants and paving use shared instanced geometry.
  Plaster, wood, lawn and stone use deterministic 256px textures with anisotropy.
  A local 512px sky is filtered once for material reflections. No remote assets
  or large environment maps are requested.
- Full side/rear openings, reveals and balcony returns allow inspection from
  every angle. Kitchen, dining, curtains and living furniture build in stages.
- Finished planting has a tiny shader breeze at a capped idle cadence. Live has
  a 1.15-degree camera drift that stops immediately on contact. Reduced motion
  disables both. Earlier stages render only when their state changes.
- All render work pauses outside the viewport or when the document is hidden.
  Observers, gestures, timers, textures, instances, shadow targets, postprocessing
  and WebGL resources are released on route changes. Context/import failure
  retains the SVG elevation fallback.
- Completion names are local to this service. Existing project tier names and
  prices remain sourced from their existing data without modification.
- Enquiry details stay in local React state and are encoded into a WhatsApp link;
  the visitor reviews and sends the message in WhatsApp.
