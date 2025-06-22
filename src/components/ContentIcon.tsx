// src/app/components/ContentIcon.tsx
import * as PhosphorIcons from "@phosphor-icons/react";
import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import { FolderIcon } from "@phosphor-icons/react/dist/ssr";

const IconMap = PhosphorIcons as unknown as Record<string, React.FC<IconProps>>;

type IconPropsType = {
  icon: string;
  size?: number;
};

export const Icon = ({ icon, size }: IconPropsType) => {
  const IconComponent = IconMap[icon] || FolderIcon;

  return <IconComponent size={size || 20} />;
};
