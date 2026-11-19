// The `lg` breakpoint: the home scene (shelves, painting, table) exists only from here up.
export const SHELVES_MIN_WIDTH_QUERY = "(min-width: 1024px)";

// 1×1 transparent GIF. A <picture> needs an <img src>, and below `lg` it is the
// only thing the browser loads, so it must not be the real picture.
export const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
