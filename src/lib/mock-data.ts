export type File = {
  id: string;
  name: string;
  type: "file";
  parent: string;
  size: string;
  url: string;
};

export type Folder = {
  id: string;
  name: string;
  type: "folder";
  parent: string | null;
};

export const mockFolders: Folder[] = [
  { id: "root", name: "root", type: "folder", parent: null },
  { id: "1", name: "Documents", type: "folder", parent: "root" },
  { id: "2", name: "Photos", type: "folder", parent: "root" },
  { id: "3", name: "Work", type: "folder", parent: "root" },
  { id: "10", name: "Presentations", type: "folder", parent: "3" },
];

export const mockFiles: File[] = [
  {
    id: "4",
    name: "Resume.pdf",
    type: "file",
    parent: "1",
    size: "1.2 MB",
    url: "example.com/some/path",
  },
  {
    id: "5",
    name: "Revenue.txt",
    type: "file",
    parent: "1",
    size: "1 KB",
    url: "example.com/some/path",
  },
  {
    id: "6",
    name: "Jane.png",
    type: "file",
    parent: "2",
    size: "4.6 MB",
    url: "example.com/some/path",
  },
  {
    id: "6",
    name: "feedback.pdf",
    type: "file",
    parent: "10",
    size: "10 MB",
    url: "example.com/some/path",
  },
];
