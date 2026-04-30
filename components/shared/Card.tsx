import { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padded?: boolean;
};

export default function Card({ children, padded = true, className = "", ...rest }: CardProps) {
  return (
    <div
      className={
        "rounded-xl border border-navy-100 bg-white shadow-card " +
        (padded ? "p-4 " : "") +
        className
      }
      {...rest}
    >
      {children}
    </div>
  );
}
