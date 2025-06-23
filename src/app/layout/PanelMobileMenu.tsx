// src/app/(panel)/layout/MobileMenu.tsx
import { PanelMenuList } from "@/app/(panel)/components/PanelMenuList";
import { Drawer, DrawerContent, DrawerDescription } from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";

type MobileMenuDrawerProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PanelMobileMenu = ({ open, setOpen }: MobileMenuDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerDescription></DrawerDescription>
        <DialogTitle className="p-6">
          <PanelMenuList onClick={() => setOpen(false)} />
        </DialogTitle>
      </DrawerContent>
    </Drawer>
  );
};
