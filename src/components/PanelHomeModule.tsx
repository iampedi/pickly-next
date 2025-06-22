// src/components/PanelHomeModule.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "./Loader";
import { Icon } from "./ContentIcon";

type PanelHomeModuleProps = {
  title: string;
  value: number;
  loading: boolean;
  icon?: string;
};

export const PanelHomeModule = ({
  title,
  value,
  loading,
  icon = "FolderIcon",
}: PanelHomeModuleProps) => {
  return (
    <Card className="gap-3 border-lime-600/25 bg-lime-50/50 p-5 text-lime-600">
      <CardHeader className="gap-0 p-0">
        <CardTitle className="flex flex-col items-center gap-3 text-center text-xl">
          <Icon icon={icon} size={34} />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <Loader />
        ) : (
          <p className="text-center text-4xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
};
