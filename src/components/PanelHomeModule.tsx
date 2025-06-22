// src/components/PanelHomeModule.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "./Loader";

type PanelHomeModuleProps = {
  title: string;
  value: number;
  loading: boolean;
};

export const PanelHomeModule = ({
  title,
  value,
  loading,
}: PanelHomeModuleProps) => {
  return (
    <Card className="gap-4 border-lime-600/25 bg-lime-50/50 text-lime-600">
      <CardHeader>
        <CardTitle className="text-center text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader />
        ) : (
          <p className="text-center text-4xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
};
