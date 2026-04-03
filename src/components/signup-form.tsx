"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "~/lib/auth-client";
import Link from "next/link";

const signupSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must at leat be 8 characters"),
});

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof signupSchema>) {
    await authClient.signUp.email({
      email: formData.email,
      name: formData.name,
      password: formData.password,
      callbackURL: "/",
    });
  }

  return (
    <Card {...props}>
      <CardContent>
        <form onSubmit={signupForm.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={signupForm.control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Field>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="email"
                    type="email"
                    placeholder="Email"
                  />
                  {fieldState.invalid && <FieldError />}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={signupForm.control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Field>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="name"
                    type="text"
                    placeholder="Full Name"
                  />
                  {fieldState.invalid && <FieldError />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={signupForm.control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Field>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="password"
                    type="password"
                    placeholder="Password"
                  />
                  {fieldState.invalid && <FieldError />}
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
