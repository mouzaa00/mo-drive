"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "~/lib/auth-client";
import Link from "next/link";

const signupSchema = z
  .object({
    email: z.email("Invalid email address"),
    name: z.string().min(1, "Name is required"),
    password: z.string().min(8, "Password must at leat be 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must at leat be 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof signupSchema>) {
    await authClient.signUp.email({
      email: formData.email,
      name: formData.name,
      password: formData.password,
      callbackURL: "/",
      fetchOptions: {
        onError: (ctx) => {
          signupForm.setError("root", { message: ctx.error.message });
        },
      },
    });
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={signupForm.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              {signupForm.formState.errors.root && (
                <FieldError errors={[signupForm.formState.errors.root]} />
              )}
            </Field>
            <Controller
              name="email"
              control={signupForm.control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel data-invalid={fieldState.invalid} htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="email"
                    type="email"
                    placeholder="Email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={signupForm.control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel data-invalid={fieldState.invalid} htmlFor="name">
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="name"
                    type="text"
                    placeholder="Full Name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={signupForm.control}
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
                    id="password"
                    type="password"
                    placeholder="Password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={signupForm.control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    data-invalid={fieldState.invalid}
                    htmlFor="confirm-password"
                  >
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FieldGroup>
              <Field>
                <Button
                  className="bg-teal-700 hover:bg-teal-700/80"
                  type="submit"
                >
                  Continue
                </Button>
                <Button
                  variant="outline"
                  onClick={async () =>
                    await authClient.signIn.social({
                      provider: "google",
                      callbackURL: "/",
                    })
                  }
                  type="button"
                >
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
