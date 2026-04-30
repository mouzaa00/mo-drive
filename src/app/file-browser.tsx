"use client";

import { useState } from "react";
import { FileIcon, Folder as FolderIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { File, Folder, mockFiles, mockFolders } from "~/lib/mock-data";

function Breadcrumbs({
  path,
  onNavigate,
}: {
  path: { id: string; name: string }[];
  onNavigate: (id: string) => void;
}) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <button
        onClick={() => onNavigate("root")}
        className="text-blue-600 hover:underline"
      >
        My Drive
      </button>
      {path.slice(1).map((folder) => (
        <span key={folder.id} className="flex items-center gap-2">
          <span className="text-gray-400">/</span>
          <button
            onClick={() => onNavigate(folder.id)}
            className="text-blue-600 hover:underline"
          >
            {folder.name}
          </button>
        </span>
      ))}
    </nav>
  );
}

export function FileRow({ file }: { file: File }) {
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
      <TableCell>{file.type}</TableCell>
      <TableCell>{file.size}</TableCell>
      <TableCell>
        <button
          className="rounded p-1 hover:bg-muted"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">More options</span>
          <span className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground">
            ⋮
          </span>
        </button>
      </TableCell>
    </TableRow>
  );
}

export function FolderRow({
  folder,
  handleFolderClick,
}: {
  folder: Folder;
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
      <TableCell>{folder.type}</TableCell>
      <TableCell>{"—"}</TableCell>
    </TableRow>
  );
}

export function FileBrowser() {
  const [currentFolderId, setCurrentFolderId] = useState<string>("root");

  const currentFiles = mockFiles.filter((f) => f.parent === currentFolderId);
  const currentFolders = mockFolders.filter(
    (f) => f.parent === currentFolderId,
  );

  const path: { id: string; name: string }[] = [];
  let folderId = currentFolderId;

  while (folderId !== "root") {
    const folder = mockFolders.find((folder) => folder.id === folderId);
    if (folder) {
      path.unshift({ id: folder.id, name: folder.name });
      folderId = folder.parent;
    }
  }
  path.unshift({ id: "root", name: "My Drive" });

  const handleNavigate = (id: string) => {
    setCurrentFolderId(id);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <Breadcrumbs path={path} onNavigate={handleNavigate} />
        <button className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <FileIcon className="h-4 w-4" />
          New upload
        </button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Name</TableHead>
              <TableHead className="w-1/3">Type</TableHead>
              <TableHead className="w-1/3">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFiles.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
            {currentFolders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                handleFolderClick={() => handleNavigate(folder.id)}
              />
            ))}
            {currentFiles.length === 0 && currentFolderId !== "root" && (
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
