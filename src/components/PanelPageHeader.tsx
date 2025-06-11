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
        "sticky top-16 md:top-20 flex h-12 items-center bg-white pb-2",
        flexClass,
        className,
      )}
    >
      <PanelPageTitle />
      {children}
    </div>
  );
};
