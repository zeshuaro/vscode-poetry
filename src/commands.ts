import { installOptions } from "./poetry-options";
import defaultPoetryService, { PoetryService } from "./poetry-service";
import { PoetryCommand } from "./types";

export class Commands {
  poetryService: PoetryService;

  constructor(poetryService: PoetryService = defaultPoetryService) {
    this.poetryService = poetryService;
  }

  installPackages = async () => await this.managePackageInstall();

  installPackagesWithOptions = async () =>
    await this.managePackageInstall({ askOptions: true });

  addPackage = async () =>
    await this.managePackage({ command: PoetryCommand.add });

  addDevPackage = async () =>
    await this.managePackage({ command: PoetryCommand.add, isDev: true });

  removePackage = async () =>
    await this.managePackage({ command: PoetryCommand.remove });

  removeDevPackage = async () =>
    await this.managePackage({ command: PoetryCommand.remove, isDev: true });

  updatePackages = async () => await this.managePackageUpdate();

  updatePackagesNoDev = async () =>
    await this.managePackageUpdate({ noDev: true });

  updatePackage = async () =>
    await this.managePackageUpdate({ askPackageName: true });

  private managePackageInstall = async ({
    askOptions = false,
  }: {
    askOptions?: boolean;
  } = {}) => {
    const args: string[] = [PoetryCommand.install];
    if (askOptions) {
      const options = await this.poetryService.promptOptions(
        installOptions.map((option) => option.description)
      );
      if (!options?.length) {
        return;
      }
      options.forEach((option) => {
        const installOption = installOptions.find(
          (e) => e.description === option
        )?.option;
        if (installOption) {
          args.push(installOption);
        }
      });
    }
    this.poetryService.runPoetry(args);
  };

  private managePackage = async ({
    command,
    isDev = false,
  }: {
    command: PoetryCommand;
    isDev?: boolean;
  }) => {
    const packageName = await this.poetryService.promptPackageName();
    if (!packageName) {
      return;
    }

    const args = [command, packageName];
    if (isDev) {
      args.push("--dev");
    }
    this.poetryService.runPoetry(args);
  };

  private managePackageUpdate = async ({
    askPackageName = false,
    noDev = false,
  }: {
    askPackageName?: boolean;
    noDev?: boolean;
  } = {}) => {
    let packageName: string | undefined;
    if (askPackageName) {
      packageName = await this.poetryService.promptPackageName();
      if (!packageName) {
        return;
      }
    }

    const args: string[] = [PoetryCommand.update];
    if (packageName) {
      args.push(packageName);
    }
    if (noDev) {
      args.push("--no-dev");
    }
    this.poetryService.runPoetry(args);
  };
}

export default new Commands();
