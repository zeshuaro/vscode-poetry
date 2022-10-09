import defaultPoetryService, { PoetryService } from "./poetry-service";
import { PoetryCommand } from "./types";

export class Commands {
  poetryService: PoetryService;

  constructor(poetryService: PoetryService = defaultPoetryService) {
    this.poetryService = poetryService;
  }

  installPackages = () => this.poetryService.installPackages();

  installPackagesWithOptions = () =>
    this.poetryService.installPackages({ askOptions: true });

  addPackage = () =>
    this.poetryService.managePackages({ command: PoetryCommand.add });

  addDevPackage = () =>
    this.poetryService.managePackages({
      command: PoetryCommand.add,
      isDev: true,
    });

  removePackage = () =>
    this.poetryService.managePackages({ command: PoetryCommand.remove });

  removeDevPackage = () =>
    this.poetryService.managePackages({
      command: PoetryCommand.remove,
      isDev: true,
    });

  updatePackages = () => this.poetryService.updatePackages();

  updatePackagesNoDev = () =>
    this.poetryService.updatePackages({ noDev: true });

  updatePackage = () =>
    this.poetryService.updatePackages({ askPackageName: true });

  lockPackages = (): void => this.poetryService.lockPackages();

  lockPackagesNoUpdate = (): void =>
    this.poetryService.lockPackages({ noUpdate: true });
}

export default new Commands();
