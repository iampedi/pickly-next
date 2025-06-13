// src/app/auth/register/form.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { handleClientError } from "@/lib/handleClientError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// UI Imports
import { UserTypesDialog } from "@/app/layout/UserTypesDialog";
import image from "@/assets/images/register.webp";
import { Agree } from "@/components/Agree";
import { Button } from "@/components/theme/Button";
import { Input } from "@/components/theme/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/theme/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CircleNotchIcon,
  CrownIcon,
  HeartIcon,
  ShieldCheckIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

const formSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  type: z.enum(["user", "curator", "admin"], {
    required_error: "User type is required",
  }),
});

type RegisterFormValues = z.infer<typeof formSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { refetch } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      type: "user",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setServerError("");

    const submitData = { ...values } as Record<string, unknown>;

    if (values.type === "curator") {
      submitData.isCurator = true;
    } else if (values.type === "admin") {
      submitData.isAdmin = true;
    }

    try {
      await axios.post("/api/auth/register", submitData, {
        withCredentials: true,
      });

      await refetch();
      form.reset();
      toast.success("Registration successful.");
      router.push("/panel");
    } catch (err) {
      handleClientError(err, "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Register</h1>
                  <p className="text-muted-foreground text-balance">
                    Create a new account
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>User Type</FormLabel>
                    <div
                      onClick={() => setOpen(true)}
                      className="flex cursor-pointer items-center gap-1 text-sm text-red-600 hover:text-black hover:underline"
                    >
                      <WarningCircleIcon size={16} /> Important Note
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">
                              <HeartIcon
                                weight="duotone"
                                className="text-rose-600"
                              />
                              User
                            </SelectItem>
                            <SelectItem value="curator">
                              <CrownIcon
                                weight="duotone"
                                className="text-rose-600"
                              />
                              Curator
                            </SelectItem>
                            <SelectItem value="admin">
                              <ShieldCheckIcon
                                weight="duotone"
                                className="text-rose-600"
                              />
                              Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircleNotchIcon className="animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>

                <div className="text-center text-sm">
                  Do have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </form>

            <UserTypesDialog open={open} setOpen={setOpen} />
          </Form>

          <div className="relative my-auto hidden bg-white md:block">
            <Image src={image} alt="Login Image" priority />
          </div>
        </CardContent>
      </Card>
      <Agree />
    </div>
  );
}
