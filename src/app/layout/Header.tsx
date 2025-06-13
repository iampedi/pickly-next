import { AuthButton } from "@/components/AuthButton";
import { Logo } from "@/components/Logo";

export const Header = () => {
  return (
    <header>
      <div className="continer mx-auto h-full max-w-5xl px-4">
        <div className="flex items-center justify-between pt-4 md:pt-5">
          <Logo />
          <div className="flex gap-2">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};
