import clsx from "clsx";

type FormNoticeProps = {
  className?: string;
  isLeaving?: boolean;
  text: string;
  title: string;
};

// Retro "system message" box shown inside the toast.
export const FormNotice = ({
  className,
  isLeaving = false,
  text,
  title,
}: FormNoticeProps) => (
  <div
    className={clsx(
      "flex flex-col gap-2 border-[1px_4px_4px_1px] border-solid border-accent bg-field p-4 font-vcr shadow-[0_8px_32px_rgb(0_0_0/0.6)] motion-reduce:animate-none",
      isLeaving ? "animate-reveal-out" : "animate-reveal-up",
      className,
    )}
  >
    <p className="text-[14px] text-white uppercase">
      <span aria-hidden="true" className="text-accent">
        {"> "}
      </span>
      {title}
    </p>
    <p className="text-[12px]/4 text-field-label">{text}</p>
  </div>
);
