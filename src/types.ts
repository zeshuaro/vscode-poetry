export enum PoetryCommand {
  install = "install",
  add = "add",
  remove = "remove",
  update = "update",
  lock = "lock",
}

export type PoetryOption = {
  description: string;
  option: string;
};
