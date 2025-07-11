// src/app/contents/create/page.tsx
import ContentForm from "../ContentForm";
import { PanelPageHeader } from "@/app/(panel)/components/PanelPageHeader";

export default function CreateContentPage() {
  return (
    <>
      <PanelPageHeader />
      
      <ContentForm mode="create" />
    </>
  );
}
