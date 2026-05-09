"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createFolder } from "~/app/actions";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldGroup } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function CreateFolderDialog(props: { parentId: string }) {
  const [name, setName] = useState("Untitled folder");
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const navigate = useRouter();

  return (
    <Dialog>
      <DialogTrigger ref={dialogTriggerRef} asChild>
        <Button variant="outline">Create Folder</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>
            Give a name to your folder here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue="Untitled folder"
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={async () => {
              toast.promise(
                async () => await createFolder(name, props.parentId),
                {
                  loading: "Creating...",
                  success: () => {
                    dialogTriggerRef.current?.click();
                    navigate.refresh();
                    return `${name} has been created`;
                  },
                  error: (error) => error.message || "An error occurred",
                },
              );
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
