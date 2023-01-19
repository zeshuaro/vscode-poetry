import { Terminal, window } from "vscode";
import { PoetryCommand, PoetryOption } from "./types";
import { PypiService } from "./pypi";

export class PoetryService {
  static groupOptions: PoetryOption[] = [
    {
      description: "Run without the dependency groups (--without)",
      value: "--without",
      promptDescription: "Enter the dependency groups to ignore (--without)",
    },
    {
      description: "Only include certain dependency groups (--only)",
      value: "--only",
      promptDescription: "Enter the dependency groups to include only (--only)",
    },
  ];

  static installOptions: PoetryOption[] = [
    ...this.groupOptions,
    {
      description:
        "[DEPRECATED, use --without] Do not install the development dependencies (--no-dev)",
      value: "--no-dev",
    },
    {
      description:
        "Do not install the root package (the current project) (--no-root)",
      value: "--no-root",
    },
    {
      description:
        "[DEPRECATED, use --sync] Remove packages not present in the lock file (--remove-untracked)",
      value: "--remove-untracked",
    },
    {
      description:
        "Synchronize the environment with the locked packages (--sync)",
      value: "--sync",
    },
  ];

  static updateOptions: PoetryOption[] = [...this.groupOptions];

  private pypiService: PypiService;
  private terminal?: Terminal;

  constructor(pypiService: PypiService) {
    this.pypiService = pypiService;
  }

  async installPackages({
    askOptions = false,
  }: {
    askOptions?: boolean;
  } = {}) {
    const args: string[] = [PoetryCommand.install];
    if (askOptions) {
      const opts = await this.getOptions(PoetryService.installOptions);
      if (opts) {
        const optionArgs = await this.getCommandOptions(opts);
        args.push(...optionArgs);
      }
    }
    this.runPoetry(args);
  }

  async managePackages({
    command,
    isDev = false,
    askGroup = false,
  }: {
    command: PoetryCommand;
    isDev?: boolean;
    askGroup?: boolean;
  }) {
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
  }

  async updatePackages({
    askPackageName = false,
    askOptions = false,
    noDev = false,
  }: {
    askPackageName?: boolean;
    askOptions?: boolean;
    noDev?: boolean;
  } = {}) {
    const args: string[] = [PoetryCommand.update];
    let packageName: string | undefined;

    if (askPackageName) {
      packageName = await this.promptPackageName();
      if (!packageName) {
        return;
      }
      args.push(packageName);
    }
    if (askOptions) {
      const opts = await this.getOptions(PoetryService.updateOptions);
      if (opts) {
        const optionArgs = await this.getCommandOptions(opts);
        args.push(...optionArgs);
      }
    }
    if (noDev) {
      args.push("--no-dev");
    }

    this.runPoetry(args);
  }

  lockPackages({ noUpdate = false }: { noUpdate?: boolean } = {}) {
    const args: string[] = [PoetryCommand.lock];
    if (noUpdate) {
      args.push("--no-update");
    }
    this.runPoetry(args);
  }

  private async getCommandOptions(options: PoetryOption[]) {
    const args = [];
    for (const opt of options) {
      if (opt.promptDescription) {
        const optVal = await this.promptOptionValue(opt.promptDescription); // skipcq: JS-0032
        if (optVal !== undefined && optVal.length > 0) {
          args.push(`${opt.value} ${optVal}`);
        }
      } else {
        args.push(opt.value);
      }
    }

    return args;
  }

  private async getOptions(options: PoetryOption[]) {
    const selectedOpts = await this.promptOptions(
      options.map((option) => option.description)
    );
    if (!selectedOpts || !selectedOpts?.length) {
      return;
    }

    return selectedOpts
      .map((opt) => options.find((e) => e.description === opt))
      .filter((opt): opt is PoetryOption => opt !== undefined);
  }

  private getTerminal() {
    if (!this.terminal || this.terminal.exitStatus) {
      this.terminal = window.createTerminal();
    }
    return this.terminal;
  }

  private promptGroup() {
    return window.showInputBox({
      title: "Enter a dependency group",
      placeHolder: "Leave it as empty to use the main dependency group",
    });
  }

  private promptOptions(items: string[]) {
    return window.showQuickPick(items, {
      canPickMany: true,
      title: "Select one or more options to run with the command",
      placeHolder: "Press space to select/unselect an option",
    });
  }

  private promptOptionValue(placeholder: string) {
    return window.showInputBox({
      title: "Enter a value for the option",
      placeHolder: placeholder,
    });
  }

  private promptPackageName() {
    return window.showInputBox({
      title: "Enter a package name, git URL or local path",
      placeHolder: "Package name, git URL or local path",
    });
  }

  private runPoetry(args: string[]) {
    const terminal = this.getTerminal();
    terminal.sendText(`poetry ${args.join(" ")}`);
  }
}
