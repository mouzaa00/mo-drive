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
  parent: string;
};

export const mockFolders: Folder[] = [
  { id: "1", name: "Documents", type: "folder", parent: "root" },
  { id: "2", name: "Photos", type: "folder", parent: "root" },
  { id: "3", name: "Work", type: "folder", parent: "root" },
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
];
