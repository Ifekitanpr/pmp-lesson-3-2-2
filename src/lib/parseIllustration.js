// Parses one of our grouped SVGs (produced by png-to-svg-converter/scripts/batch-group.mjs)
// into a plain-data structure: overall canvas size, plus one entry per
// top-level <g data-part="..."> group (background / part-N / connectors),
// each carrying its bounding-box center/size and inner markup.
export function parseIllustrationSvg(svgString) {
  const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgEl = doc.documentElement;
  const width = parseFloat(svgEl.getAttribute("width")) || 0;
  const height = parseFloat(svgEl.getAttribute("height")) || 0;

  const parts = Array.from(svgEl.children)
    .filter((el) => el.tagName === "g")
    .map((g) => ({
      id: g.getAttribute("data-part"),
      cx: parseFloat(g.getAttribute("data-cx")) || width / 2,
      cy: parseFloat(g.getAttribute("data-cy")) || height / 2,
      w: parseFloat(g.getAttribute("data-w")) || width,
      h: parseFloat(g.getAttribute("data-h")) || height,
      innerHTML: g.innerHTML,
    }));

  return {
    width,
    height,
    background: parts.find((p) => p.id === "background") || null,
    connectors: parts.find((p) => p.id === "connectors") || null,
    iconParts: parts.filter((p) => p.id && p.id.startsWith("part-")),
  };
}
