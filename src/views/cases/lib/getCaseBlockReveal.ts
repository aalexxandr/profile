// The picture and the window of a case block slide in from opposite sides,
// matching the alternating layout. Only the first block is on the first
// screen, so the rest wait until they are scrolled into view.
export const getCaseBlockReveal = (index: number) => {
  const isEven = index % 2 === 0;

  return {
    pictureDirection: isEven ? "left" : "right",
    trigger: index === 0 ? "mount" : "visible",
    windowDirection: isEven ? "right" : "left",
  } as const;
};
