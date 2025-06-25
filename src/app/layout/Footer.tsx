// src/components/Footer.tsx
export const Footer = () => {
  return (
    <footer>
      <div className="continer mx-auto h-full max-w-5xl px-4">
        <div className="flex h-16 items-center justify-center">
          <p className="text-muted-foreground text-[15px]">
            &copy; 2025 Pickly. Desing with 🔥 by{" "}
            <a
              className="underline underline-offset-3 hover:text-black"
              href="https://github.com/iampedi"
              target="_blank"
            >
              Pediland
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};
