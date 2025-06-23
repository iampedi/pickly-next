// src/app/components/ContentIcon.tsx
import * as PhosphorIcons from "@phosphor-icons/react";
import { FolderIcon } from "@phosphor-icons/react/dist/ssr";

const IconMap = PhosphorIcons as unknown as Record<
  string,
  React.FC<PhosphorIcons.IconProps>
>;

type IconPropsType = {
  icon: string;
  size?: number;
  className?: string;
  weight?: PhosphorIcons.IconWeight;
};

export const Icon = ({ icon, size, className, weight }: IconPropsType) => {
  const IconComponent = IconMap[icon] || FolderIcon;

  return (
    <IconComponent size={size || 20} className={className} weight={weight} />
  );
};
