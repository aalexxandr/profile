import clsx from "clsx";
import Image, { type ImageProps } from "next/image";

type ImageWithFallbackProps = Pick<
  ImageProps,
  "alt" | "className" | "height" | "loading" | "width"
> & {
  blurSrc?: string | null;
  fallback: string;
  src: string | null;
};

// Renders the picture, or the given text in the same box when there is none.
export const ImageWithFallback = ({
  alt,
  blurSrc,
  className,
  fallback,
  src,
  ...imageProps
}: ImageWithFallbackProps) => {
  if (!src) {
    return (
      <div
        className={clsx(
          "flex aspect-520/430 items-center justify-center border-2 border-dashed border-accent p-4 text-center font-vcr text-accent uppercase",
          className,
        )}
      >
        {fallback}
      </div>
    );
  }

  return (
    <Image
      {...imageProps}
      alt={alt}
      blurDataURL={blurSrc ?? undefined}
      className={className}
      placeholder={blurSrc ? "blur" : undefined}
      src={src}
    />
  );
};
