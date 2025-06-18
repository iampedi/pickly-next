// src/app/auth/register/UserTypesDialog.tsx
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type UserTypesDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserTypesDialog = ({ open, setOpen }: UserTypesDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Important Note
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            This project is a beta version developed for an IronHack bootcamp
            assignment and made available live for portfolio review. To help
            recruiters and technical leads test all features, you can choose
            your user type during registration and experience different access
            levels.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
