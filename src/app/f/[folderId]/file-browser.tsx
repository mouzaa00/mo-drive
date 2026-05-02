import { FileIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
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
        <Link href={`/f/${folder.id}`}>{"—"}</Link>
      </TableCell>
    </TableRow>
  );
}

export function FileBrowser(props: {
  files: (typeof filesTable.$inferSelect)[];
  folders: (typeof foldersTable.$inferSelect)[];
}) {
  const breadcrumbs: unknown[] = [];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/f/1" className="text-blue-600 hover:underline">
            My Drive
          </Link>
          {breadcrumbs.map((folder) => (
            <span key={folder.id} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              <Link
                href={`/f/${folder.id}`}
                className="text-blue-600 hover:underline"
              >
                {folder.name}
              </Link>
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
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead className="w-1/2">Size</TableHead>
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
