"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { redirect } from "next/navigation";
import { authClient } from "~/lib/auth-client";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must at least be 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must at least be 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof resetPasswordSchema>) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    if (!token) {
      resetPasswordForm.setError("root", {
        message: "Token is missing from the URL.",
      });
      return;
    }
    await authClient.resetPassword({
      newPassword: formData.password,
      token,
      fetchOptions: {
        onError: (ctx) => {
          resetPasswordForm.setError("root", { message: ctx.error.message });
        },
        onSuccess: async () => {
          if (email) {
            await authClient.signIn.email({
              email,
              password: formData.password,
            });
          }
          redirect("/");
        },
      },
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={resetPasswordForm.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                {resetPasswordForm.formState.errors.root && (
                  <FieldError
                    errors={[resetPasswordForm.formState.errors.root]}
                  />
                )}
              </Field>
              <Controller
                name="password"
                control={resetPasswordForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="password"
                    >
                      Password
                    </FieldLabel>

                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={resetPasswordForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="password"
                    >
                      Password
                    </FieldLabel>

                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button
                  className="bg-teal-700 hover:bg-teal-700/80"
                  type="submit"
                >
                  Reset Password
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
