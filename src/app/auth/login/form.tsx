// src/app/auth/login/form.tsx
"use client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
// UI Imports
import image from "@/assets/images/login.webp";
import { Agree } from "@/components/Agree";
import { Button } from "@/components/theme/Button";
import { Input } from "@/components/theme/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

// Zod schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const { refetch } = useAuth();

  useEffect(() => {
    if (message === "login-required") {
      toast.info("You must be logged in to access this page.");
    }
  }, [message]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    setLoading(true);

    try {
      await axios.post("/api/auth/login", values);
      await refetch();
      const next = searchParams.get("next");
      router.push(next || "/panel?login=true");
    } catch (err) {
      setLoading(false);
      let errorMsg = "Login failed.";
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.error || err.message || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your PICKLY account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    {/* <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <CircleNotchIcon className="animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="underline underline-offset-4"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-white md:block">
            <Image src={image} alt="Login Image" priority />
          </div>
        </CardContent>
      </Card>
      <Agree />
    </div>
  );
}
