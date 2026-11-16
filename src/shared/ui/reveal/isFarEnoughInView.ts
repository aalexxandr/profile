// A block counts as in view once a fifth of it is visible. A block taller than
// the viewport never reaches that share on screen, so it also counts once it
// fills a quarter of the viewport height.
export const MIN_VISIBLE_RATIO = 0.2;
const MIN_VIEWPORT_SHARE = 0.25;

type VisibilityEntry = Pick<
  IntersectionObserverEntry,
  "intersectionRatio" | "intersectionRect" | "isIntersecting" | "rootBounds"
>;

export const isFarEnoughInView = ({
  intersectionRatio,
  intersectionRect,
  isIntersecting,
  rootBounds,
}: VisibilityEntry) => {
  if (!isIntersecting) {
    return false;
  }

  if (intersectionRatio >= MIN_VISIBLE_RATIO) {
    return true;
  }

  return (
    rootBounds !== null &&
    intersectionRect.height >= rootBounds.height * MIN_VIEWPORT_SHARE
  );
};
