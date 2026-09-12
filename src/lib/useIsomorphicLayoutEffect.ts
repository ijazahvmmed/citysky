import { useEffect, useLayoutEffect } from "react";

/**
 * GSAP mutates DOM structure: ScrollTrigger `pin` wraps the pinned element in
 * a `.pin-spacer`, and SplitText replaces a heading's text node with line
 * wrappers. React runs `useEffect` cleanups *after* it removes deleted DOM, so
 * a useEffect-based teardown leaves those mutations in place and React throws
 * "removeChild: The node to be removed is not a child of this node" on route
 * change. Layout-effect cleanups run synchronously *before* removal, which
 * gives GSAP the chance to restore the original DOM first.
 *
 * Falls back to useEffect on the server, where layout effects warn and no
 * animation runs anyway.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
