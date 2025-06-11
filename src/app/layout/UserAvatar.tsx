// src/app/layout/UserAvatar.tsx

"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
// UI Imports
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@phosphor-icons/react/dist/ssr";
import { useEffect } from "react";

export const UserAvatar = () => {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/?logout=true");
  };

  const getInitials = (name: string) => {
    if (!name?.trim()) return "?";
    return name
      .split(" ")
      .filter((part) => part.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  if (loading) return <Loader />;

  if (!user) return <div>?</div>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="group flex items-center gap-2">
          <span className="font-medium group-hover:bg-lime-100">
            {user.fullname}
          </span>
          <Avatar>
            <AvatarImage
              src={user.avatarUrl || "https://github.com/shadcn.png"}
              className="opacity-80 group-hover:opacity-100"
            />
            <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="center">
        <DropdownMenuLabel className="flex items-center gap-2 text-rose-600">
          {!user ? (
            <span>Loading...</span>
          ) : user.isAdmin ? (
            <>
              <HeartIcon className="size-5" weight="duotone" />
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
