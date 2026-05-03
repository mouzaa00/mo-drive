"use client";

import { FileIcon, FolderIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { deleteFile } from "~/app/actions";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { filesTable, foldersTable } from "~/db/schema";
import { UploadButton } from "~/lib/uploadthing";

export function FileRow({ file }: { file: typeof filesTable.$inferSelect }) {
  const navigate = useRouter();

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell>
        <a
          href={file.url}
          target="_blank"
          className="flex items-center gap-3 py-3"
        >
          <span className="shrink-0">
            <FileIcon className="w-5 h-5 text-gray-500" />
          </span>
          <span className="font-medium text-foreground">{file.name}</span>
        </a>
      </TableCell>
      <TableCell>
        <a href={file.url} target="_blank" className="flex py-3">
          {file.size}
        </a>
      </TableCell>
      <TableCell>
        <Button
          variant="destructive"
          onClick={() => {
            deleteFile(file.id);
            navigate.refresh();
          }}
        >
          <Trash2Icon />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function FolderRow({
  folder,
}: {
  folder: typeof foldersTable.$inferSelect;
}) {
  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell>
        <Link href={`/f/${folder.id}`} className="flex items-center gap-3 py-3">
          <span className="shrink-0">
            <FolderIcon className="w-5 h-5 text-blue-500" />
          </span>
          <span className="font-medium text-foreground">{folder.name}</span>
        </Link>
      </TableCell>
      <TableCell>
        <Link href={`/f/${folder.id}`} className="flex py-3">
          {"—"}
        </Link>
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}

export function FileBrowser(props: {
  files: (typeof filesTable.$inferSelect)[];
  folders: (typeof foldersTable.$inferSelect)[];
  parents: (typeof foldersTable.$inferSelect)[];
  currentFolderId: string;
}) {
  const navigate = useRouter();

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          {props.parents.map((folder) => (
            <Fragment key={folder.id}>
              {folder.name === "root" ? (
                <Link
                  href={`/f/${folder.id}`}
                  className="text-blue-600 hover:underline"
                >
                  My Drive
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-gray-400">/</span>
                  <Link
                    href={`/f/${folder.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {folder.name}
                  </Link>
                </span>
              )}
            </Fragment>
          ))}
        </nav>
        <UploadButton
          endpoint="driveUploader"
          onClientUploadComplete={() => {
            navigate.refresh();
          }}
          input={{ folderId: props.currentFolderId }}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead className="w-1/2">Size</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
            {props.files.length === 0 && props.folders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  This folder is empty
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
