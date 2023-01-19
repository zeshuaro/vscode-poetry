import { commands, ExtensionContext } from "vscode";
import { CacheService } from "./cache-service";
import { ExtensionService } from "./extension-service";
import { PoetryService } from "./poetry-service";

export function activate(context: ExtensionContext): void {
  const cacheService = new CacheService(context.globalStorageUri);
  const poetryService = new PoetryService(cacheService);
  const extensionService = new ExtensionService(poetryService);

  context.subscriptions.push(
    ...[
      commands.registerCommand(
        "vscode-python-poetry.installPackages",
        /* istanbul ignore next */
        () => extensionService.installPackages()
      ),
      commands.registerCommand(
        "vscode-python-poetry.installPackagesWithOptions",
        /* istanbul ignore next */
        () => extensionService.installPackagesWithOptions()
      ),
      commands.registerCommand(
        "vscode-python-poetry.addPackage",
        /* istanbul ignore next */
        () => extensionService.addPackage()
      ),
      commands.registerCommand(
        "vscode-python-poetry.addDevPackageLegacy",
        /* istanbul ignore next */
        () => extensionService.addDevPackageLegacy()
      ),
      commands.registerCommand(
        "vscode-python-poetry.removePackage",
        /* istanbul ignore next */
        () => extensionService.removePackage()
      ),
      commands.registerCommand(
        "vscode-python-poetry.removeDevPackageLegacy",
        /* istanbul ignore next */
        () => extensionService.removeDevPackageLegacy()
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackages",
        /* istanbul ignore next */
        () => extensionService.updatePackages()
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackagesWithOptions",
        /* istanbul ignore next */
        () => extensionService.updatePackagesWithOptions()
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackagesNoDev",
        /* istanbul ignore next */
        () => extensionService.updatePackagesNoDev()
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackage",
        /* istanbul ignore next */
        () => extensionService.updatePackage()
      ),
      commands.registerCommand(
        "vscode-python-poetry.lockPackages",
        /* istanbul ignore next */
        () => extensionService.lockPackages()
      ),
      commands.registerCommand(
        "vscode-python-poetry.lockPackagesNoUpdate",
        /* istanbul ignore next */
        () => extensionService.lockPackagesNoUpdate()
      ),
    ]
  );
}

export function deactivate(): void {
  // This method is called when the extension is deactivated
}
