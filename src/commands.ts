import defaultPoetryService, { PoetryService } from "./poetry-service";
import { PoetryCommand } from "./types";

export class Commands {
  poetryService: PoetryService;

  constructor(poetryService: PoetryService = defaultPoetryService) {
    this.poetryService = poetryService;
  }

  installPackages() {
    this.poetryService.installPackages();
  }

  installPackagesWithOptions() {
    this.poetryService.installPackages({ askOptions: true });
  }

  addPackage() {
    this.poetryService.managePackages({
      command: PoetryCommand.add,
      askGroup: true,
    });
  }

  addDevPackageLegacy() {
    this.poetryService.managePackages({
      command: PoetryCommand.add,
      isDev: true,
    });
  }

  removePackage() {
    this.poetryService.managePackages({
      command: PoetryCommand.remove,
      askGroup: true,
    });
  }

  removeDevPackageLegacy() {
    this.poetryService.managePackages({
      command: PoetryCommand.remove,
      isDev: true,
    });
  }

  updatePackages() {
    this.poetryService.updatePackages();
  }

  updatePackagesWithOptions() {
    this.poetryService.updatePackages({ askOptions: true });
  }

  updatePackagesNoDev() {
    this.poetryService.updatePackages({ noDev: true });
  }

  updatePackage() {
    this.poetryService.updatePackages({ askPackageName: true });
  }

  lockPackages() {
    this.poetryService.lockPackages();
  }

  lockPackagesNoUpdate() {
    this.poetryService.lockPackages({ noUpdate: true });
  }
}

export default new Commands();
