import { Footer } from "@/app/layout/Footer";
import { Header } from "@/app/layout/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="_site flex flex-1 flex-col">
      <Header />

      {children}

      <Footer />
    </div>
  );
}
