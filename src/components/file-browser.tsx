"use client";

import { useState } from "react";
import {
  FileIcon,
  Folder as FolderIcon,
  FileText,
  ImageIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { MockFile, mockFiles } from "~/lib/mock-data";

function getIcon(file: MockFile) {
  if (file.type === "folder") {
    return <FolderIcon className="h-5 w-5 text-blue-500" />;
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "gif") {
    return <ImageIcon className="h-5 w-5 text-pink-500" />;
  }
  if (ext === "pdf") {
    return <FileIcon className="h-5 w-5 text-red-500" />;
  }
  return <FileText className="h-5 w-5 text-gray-500" />;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Breadcrumbs({
  path,
  onNavigate,
}: {
  path: { id: string; name: string }[];
  onNavigate: (id: string | null) => void;
}) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <button
        onClick={() => onNavigate(null)}
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

export function FileBrowser() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const today = new Date();

  const currentFiles = mockFiles.filter((f) => f.parent === currentFolderId);

  const path: { id: string; name: string }[] = [];
  let folderId: string | null = currentFolderId;
  while (folderId) {
    const folder = mockFiles.find((f) => f.id === folderId);
    if (folder) {
      path.unshift({ id: folder.id, name: folder.name });
      folderId = folder.parent;
    }
  }
  path.unshift({ id: "root", name: "My Drive" });

  const handleNavigate = (id: string | null) => {
    setCurrentFolderId(id);
  };

  const handleItemClick = (file: MockFile) => {
    if (file.type === "folder") {
      setCurrentFolderId(file.id);
    } else if (file.url) {
      window.open(file.url, "_blank");
    }
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
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead className="w-1/4">Owner</TableHead>
              <TableHead className="w-1/4">Last modified</TableHead>
              <TableHead className="w-20">Size</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFiles.map((file) => (
              <TableRow
                key={file.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleItemClick(file)}
              >
                <TableCell className="flex items-center gap-3 py-3">
                  <span className="shrink-0">{getIcon(file)}</span>
                  <span className="font-medium text-foreground">
                    {file.name}
                  </span>
                </TableCell>
                <TableCell>me</TableCell>
                <TableCell>{formatDate(today)}</TableCell>
                <TableCell>{file.type === "file" ? file.size : "—"}</TableCell>
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
            ))}
            {currentFiles.length === 0 && currentFolderId !== null && (
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
