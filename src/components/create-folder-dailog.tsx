"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const navigate = useRouter();

  return (
    <Dialog>
      <DialogTrigger ref={dialogTriggerRef} asChild>
        <Button variant="outline">Create Folder</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <span className="text-sm font-medium text-red-800">{error}</span>
          </div>
        )}
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
              const result = await createFolder(name, props.parentId);
              if (result.error) {
                setError(result.error);
                return;
              }

              setError(null);
              dialogTriggerRef.current?.click();
              navigate.refresh();
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
