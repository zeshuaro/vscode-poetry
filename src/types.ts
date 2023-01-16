export enum PoetryCommand {
  install = "install",
  add = "add",
  remove = "remove",
  update = "update",
  lock = "lock",
}

export type PoetryOption = {
  description: string;
  value: string;
  promptDescription?: string;
};

export type CachePackage = {
  name: string;
};

export type CachePackageData = {
  packages: CachePackage[];
};

// eslint-disable-next-line @typescript-eslint/naming-convention
type PypiLastSerial = { "_last-serial": number };

// eslint-disable-next-line @typescript-eslint/naming-convention
type PypiSimpleMeta = PypiLastSerial & { "api-version": string };

type PypiProject = PypiLastSerial & { name: string };

export type PypiSimple = { meta: PypiSimpleMeta; packages: PypiProject[] };
