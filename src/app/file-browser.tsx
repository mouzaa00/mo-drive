"use client";

import { useState } from "react";
import { FileIcon, FolderIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { filesTable, foldersTable } from "~/db/schema";

export function FileRow({ file }: { file: typeof filesTable.$inferSelect }) {
  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell className="flex items-center gap-3 py-3">
        <span className="shrink-0">
          <FileIcon className="w-5 h-5 text-gray-500" />
        </span>
        <a
          href={file.url}
          target="_blank"
          className="font-medium text-foreground"
        >
          {file.name}
        </a>
      </TableCell>
      <TableCell>{file.size}</TableCell>
    </TableRow>
  );
}

export function FolderRow({
  folder,
  handleFolderClick,
}: {
  folder: typeof foldersTable.$inferSelect;
  handleFolderClick: () => void;
}) {
  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={handleFolderClick}
    >
      <TableCell className="flex items-center gap-3 py-3">
        <span className="shrink-0">
          <FolderIcon className="w-5 h-5 text-blue-500" />
        </span>
        <span className="font-medium text-foreground">{folder.name}</span>
      </TableCell>
      <TableCell>{"—"}</TableCell>
    </TableRow>
  );
}

export function FileBrowser(props: {
  files: (typeof filesTable.$inferSelect)[];
  folders: (typeof foldersTable.$inferSelect)[];
}) {
  const [currentFolderId, setCurrentFolderId] = useState<number>(1);

  const breadcrumbs = [];
  let folderId = currentFolderId;

  while (folderId !== 1) {
    const folder = props.folders.find((folder) => folder.id === folderId);
    if (folder) {
      breadcrumbs.unshift(folder);
      folderId = folder.parentId ?? 1;
    }
  }

  const handleNavigate = (id: number) => {
    setCurrentFolderId(id);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          <button
            onClick={() => handleNavigate(1)}
            className="text-blue-600 hover:underline"
          >
            My Drive
          </button>
          {breadcrumbs.map((folder) => (
            <span key={folder.id} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              <button
                onClick={() => handleNavigate(folder.id)}
                className="text-blue-600 hover:underline"
              >
                {folder.name}
              </button>
            </span>
          ))}
        </nav>
        <button className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <FileIcon className="h-4 w-4" />
          New upload
        </button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead className="w-1/2">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                handleFolderClick={() => handleNavigate(folder.id)}
              />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
            {props.files.length === 0 &&
              props.folders.length === 0 &&
              currentFolderId !== 1 && (
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
