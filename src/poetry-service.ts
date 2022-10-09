import { Terminal, window } from "vscode";
import { PoetryCommand, PoetryOption } from "./types";

export class PoetryService {
  terminal?: Terminal;

  static installOptions: PoetryOption[] = [
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

  installPackages = async ({
    askOptions = false,
  }: {
    askOptions?: boolean;
  } = {}) => {
    const args: string[] = [PoetryCommand.install];
    if (askOptions) {
      const options = await this.getInstallOptions();
      options?.forEach((option) => {
        if (option) {
          args.push(option);
        }
      });
    }
    this.runPoetry(args);
  };

  managePackages = async ({
    command,
    isDev = false,
    askGroup = false,
  }: {
    command: PoetryCommand;
    isDev?: boolean;
    askGroup?: boolean;
  }) => {
    const packageName = await this.promptPackageName();
    if (!packageName) {
      return;
    }

    const args = [command, packageName];
    if (isDev) {
      args.push("--dev");
    }
    if (askGroup) {
      const group = await this.promptGroup();
      if (group === undefined) {
        return;
      }
      if (group.length > 0) {
        args.push(`--group ${group}`);
      }
    }

    this.runPoetry(args);
  };

  updatePackages = async ({
    askPackageName = false,
    noDev = false,
  }: {
    askPackageName?: boolean;
    noDev?: boolean;
  } = {}) => {
    const args: string[] = [PoetryCommand.update];
    let packageName: string | undefined;

    if (askPackageName) {
      packageName = await this.promptPackageName();
      if (!packageName) {
        return;
      }
      args.push(packageName);
    }
    if (noDev) {
      args.push("--no-dev");
    }

    this.runPoetry(args);
  };

  lockPackages = ({ noUpdate = false }: { noUpdate?: boolean } = {}) => {
    const args: string[] = [PoetryCommand.lock];
    if (noUpdate) {
      args.push("--no-update");
    }
    this.runPoetry(args);
  };

  private getInstallOptions = async () => {
    const options = await this.promptOptions(
      PoetryService.installOptions.map((option) => option.description)
    );
    if (!options || !options?.length) {
      return;
    }

    return options.map(
      (option) =>
        PoetryService.installOptions.find((e) => e.description === option)
          ?.option
    );
  };

  private getTerminal = () => {
    if (!this.terminal || this.terminal.exitStatus) {
      this.terminal = window.createTerminal();
    }
    return this.terminal;
  };

  private promptGroup = () =>
    window.showInputBox({
      title: "Enter a dependency group",
      placeHolder: "Leave it as empty to use the main dependency group",
    });

  private promptOptions = (items: string[]) =>
    window.showQuickPick(items, {
      canPickMany: true,
      title: "Select one or more options to run with the command",
      placeHolder: "Press space to select/unselect an option",
    });

  private promptPackageName = () =>
    window.showInputBox({
      title: "Enter a package name, git URL or local path",
      placeHolder: "Package name, git URL or local path",
    });

  private runPoetry = (args: string[]): void => {
    const terminal = this.getTerminal();
    terminal.sendText(`poetry ${args.join(" ")}`);
  };
}

export default new PoetryService();
