import type { PropsWithChildren } from "react";

type Props = {
  className?: string;
} & PropsWithChildren;

export const Container = ({ children, className = "" }: Props) => {
  return (
    <div className={`relative w-full flex justify-center ` + className}>
      <div className="w-full max-w-screen-lg flex flex-row px-6 sm:px-12 items-center">
        {children}
      </div>
    </div>
  );
};
