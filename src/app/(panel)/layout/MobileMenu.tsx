// src/app/(panel)/layout/MobileMenu.tsx
import { MenuList } from "@/app/(panel)/layout/MenuList";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";

type MobileMenuDrawerProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MobileMenu = ({ open, setOpen }: MobileMenuDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DialogTitle className="p-6">
          <MenuList onClick={() => setOpen(false)} />
        </DialogTitle>
      </DrawerContent>
    </Drawer>
  );
};
