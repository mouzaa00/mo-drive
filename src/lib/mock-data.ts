export type MockFile = {
  id: string;
  name: string;
  type: "folder" | "file";
  parent: string | null;
  size?: string;
  url?: string;
};

export const mockFiles: MockFile[] = [
  { id: "1", name: "Documents", type: "folder", parent: null },
  { id: "2", name: "Photos", type: "folder", parent: null },
  { id: "3", name: "Work", type: "folder", parent: null },
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
