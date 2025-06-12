import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { MenuList } from "./MenuList";
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
