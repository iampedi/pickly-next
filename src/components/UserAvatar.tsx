// src/app/layout/UserAvatar.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { handleClientError } from "@/lib/handleClientError";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

// UI Imports
import Loader from "@/components/Loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CrownIcon,
  HeartIcon,
  PowerIcon,
  ShieldCheckIcon,
  SquaresFourIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { LoginButton } from "@/app/(site)/components/LoginButton";
import { HouseIcon } from "@phosphor-icons/react";

export const UserAvatar = () => {
  const { user, loading, setUser, refetch } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  if (loading) return <Loader />;

  if (!user) return <LoginButton />;

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
      <DropdownMenuContent className="w-40" align="center">
        <DropdownMenuLabel className="flex items-center gap-1.5 text-rose-600">
          {user.role === "ADMIN" ? (
            <>
              <ShieldCheckIcon size={20} weight="duotone" />
              <span>Admin</span>
            </>
          ) : user.role === "CURATOR" ? (
            <>
              <CrownIcon size={20} weight="duotone" />
              <span>Curator</span>
            </>
          ) : (
            <>
              <HeartIcon size={20} weight="duotone" />
              <span>User</span>
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {(user.role === "ADMIN" || user.role === "CURATOR") &&
            (pathname.includes("/panel") ? (
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => router.push("/")}
              >
                Home
                <DropdownMenuShortcut>
                  <HouseIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => router.push("/panel")}
              >
                Dashboard
                <DropdownMenuShortcut>
                  <SquaresFourIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100"
            onClick={handleLogout}
          >
            Log out
            <DropdownMenuShortcut>
              <PowerIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
