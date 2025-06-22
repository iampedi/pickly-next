// src/app/components/ContentIcon.tsx
import * as PhosphorIcons from "@phosphor-icons/react";
import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import { FolderIcon } from "@phosphor-icons/react/dist/ssr";

const IconMap = PhosphorIcons as unknown as Record<string, React.FC<IconProps>>;

export const Icon = ({ icon }: { icon: string }) => {
  const IconComponent = IconMap[icon] || FolderIcon;

  return <IconComponent size={20} />;
};
