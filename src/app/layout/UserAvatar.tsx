// src/app/layout/UserAvatar.tsx
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// UI Imports
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CrownIcon,
  PowerIcon,
  ToggleLeftIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

type User = {
  id: string;
  fullname: string;
  email: string;
  isCurator: boolean;
  avatarUrl?: string;
};

export const UserAvatar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
      } catch (error) {
        setError("Failed to fetch user data");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    router.push("/?logout=true");
  };

  if (loading) return <Loader />;

  if (error) return <div>?</div>;

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="group flex items-center gap-2">
          {user && (
            <span className="font-medium group-hover:bg-lime-100">
              {user.fullname}
            </span>
          )}
          <Avatar>
            <AvatarImage
              src={user?.avatarUrl || "https://github.com/shadcn.png"}
              className="opacity-80 group-hover:opacity-100"
            />
            <AvatarFallback>{getInitials(user?.fullname || "")}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="center">
        <DropdownMenuLabel className="flex items-center gap-2 text-rose-600">
          {user?.isCurator ? (
            <>
              <CrownIcon className="size-5" weight="duotone" /> Curator
            </>
          ) : (
            "User"
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:bg-gray-100">
            <UserCircleIcon className="text-primary size-5" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-100">
            <ToggleLeftIcon className="text-primary size-5" /> Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer" onClick={logout}>
          <PowerIcon className="text-primary size-5" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
