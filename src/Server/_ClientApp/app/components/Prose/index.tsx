import type { PropsWithChildren } from "react";

type Props = {
  className?: string;
} & PropsWithChildren;

export const Prose = ({ children, className = "" }: Props) => {
  return (
    <div
      className={
        `prose max-w-full dark:prose-invert prose-zinc prose-a:text-purple-400 prose-p:text-justify prose-img:rounded-xl text-base xl:text-xl` +
        className
      }
    >
      {children}
    </div>
  );
};
