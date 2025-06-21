// src/app/panel/curations/create/page.tsx
import { PanelPageHeader } from "@/components/PanelPageHeader";
import ContentCurationForm from "../CurationForm";

export default function CreateCurationPage() {
  return (
    <>
      <PanelPageHeader />

      <ContentCurationForm mode="create" />
    </>
  );
}
