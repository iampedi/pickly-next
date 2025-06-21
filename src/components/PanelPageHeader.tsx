import React from "react";
import { PanelPageTitle } from "./PanelPageTitle";
import { cn } from "@/lib/utils";

type PositionProps = {
  children?: React.ReactNode;
  className?: string;
};

export const PanelPageHeader = ({ children, className }: PositionProps) => {
  const flexClass =
    React.Children.count(children) > 0 ? "justify-between" : "justify-center";

  return (
    <div
      className={cn(
        "sticky top-16 z-10 flex flex-col items-center gap-2 bg-white pb-2 md:top-20 md:h-12 md:flex-row",
        flexClass,
        className,
      )}
    >
      <PanelPageTitle />
      {children}
    </div>
  );
};
