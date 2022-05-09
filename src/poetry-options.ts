import { PoetryOption } from "./types";

export const installOptions: PoetryOption[] = [
  {
    description: "Do not install the development dependencies",
    option: "--no-dev",
  },
  {
    description: "Do not install the root package (the current project)",
    option: "--no-root",
  },
  {
    description: "Removes packages not present in the lock file",
    option: "--remove-untracked",
  },
];
