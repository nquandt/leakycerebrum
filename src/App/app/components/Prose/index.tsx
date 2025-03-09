import type { PropsWithChildren } from "react";

type Props = {
  className?: string;
} & PropsWithChildren;

export const Prose = ({ children, className = "" }: Props) => {
  return (
    <div
      className={
        `prose max-w-full dark:prose-invert prose-zinc prose-h1:font-bold prose-h1:text-xl prose-a:text-purple-400 prose-p:text-justify prose-img:rounded-xl prose-headings:underline ` +
        className
      }
    >
      {children}
    </div>
  );
};
