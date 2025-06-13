// src/app/layout/UserAvatar.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { handleClientError } from "@/lib/handleClientError";
import axios from "axios";
import { useRouter } from "next/navigation";

// UI Imports
import Loader from "@/components/Loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CrownIcon,
  HeartIcon,
  PowerIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

export const UserAvatar = () => {
  const { user, loading, setUser, refetch } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      await refetch();
      toast.success("Logout successful.");
      router.push("/");
    } catch (err) {
      handleClientError(err, "Logout failed.");
      setUser(null);
    }
  };

  const getFirstName = (name: string) => {
    if (!name?.trim()) return "?";
    return name.trim().split(" ")[0];
  };

  if (loading || !user) return <Loader />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="group flex items-center gap-1.5">
          <span className="font-medium group-hover:bg-lime-100">
            Hi {getFirstName(user.fullname)}
          </span>
          <UserCircleIcon
            className="group-hover:text-lime-700"
            size={30}
            weight="duotone"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="center">
        <DropdownMenuLabel className="flex items-center gap-2 text-rose-600">
          {user.isAdmin ? (
            <>
              <ShieldCheckIcon className="size-5" weight="duotone" />
              <span className="uppercase">Admin</span>
            </>
          ) : user.isCurator ? (
            <>
              <CrownIcon className="size-5" weight="duotone" />
              <span className="uppercase">Curator</span>
            </>
          ) : (
            <>
              <HeartIcon className="size-5" weight="duotone" />
              <span className="uppercase">User</span>
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-100"
          onClick={handleLogout}
        >
          <PowerIcon className="text-primary size-5" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
