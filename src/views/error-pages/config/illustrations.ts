// Pixel-art pictures of the error pages (`public/`) and their intrinsic sizes.
export const ERROR_ILLUSTRATIONS = {
  notFound: { src: "/404-bg.svg", width: 686, height: 651 },
  serverError: { src: "/500-bg.svg", width: 423, height: 205 },
} as const;

export type ErrorScreenVariant = keyof typeof ERROR_ILLUSTRATIONS;
