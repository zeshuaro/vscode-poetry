import { PoetryService } from "./poetry/poetryService";
import { PoetryCommand } from "./types";

export class ExtensionService {
  poetryService: PoetryService;

  constructor(poetryService: PoetryService) {
    this.poetryService = poetryService;
  }

  installPackages() {
    return this.poetryService.installPackages();
  }

  installPackagesWithOptions() {
    return this.poetryService.installPackages({ askOptions: true });
  }

  addPackage() {
    return this.poetryService.managePackages({
      command: PoetryCommand.add,
      askGroup: true,
    });
  }

  addDevPackageLegacy() {
    return this.poetryService.managePackages({
      command: PoetryCommand.add,
      isDev: true,
    });
  }

  removePackage() {
    return this.poetryService.managePackages({
      command: PoetryCommand.remove,
      askGroup: true,
    });
  }

  removeDevPackageLegacy() {
    return this.poetryService.managePackages({
      command: PoetryCommand.remove,
      isDev: true,
    });
  }

  updatePackages() {
    return this.poetryService.updatePackages();
  }

  updatePackagesWithOptions() {
    return this.poetryService.updatePackages({ askOptions: true });
  }

  updatePackagesNoDev() {
    return this.poetryService.updatePackages({ noDev: true });
  }

  updatePackage() {
    return this.poetryService.updatePackages({ askPackageName: true });
  }

  lockPackages() {
    return this.poetryService.lockPackages();
  }

  lockPackagesNoUpdate() {
    return this.poetryService.lockPackages({ noUpdate: true });
  }
}
