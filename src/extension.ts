import { commands, ExtensionContext } from "vscode";
import extensionService from "./extension-service";

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    ...[
      commands.registerCommand(
        "vscode-python-poetry.installPackages",
        extensionService.installPackages
      ),
      commands.registerCommand(
        "vscode-python-poetry.installPackagesWithOptions",
        extensionService.installPackagesWithOptions
      ),
      commands.registerCommand(
        "vscode-python-poetry.addPackage",
        extensionService.addPackage
      ),
      commands.registerCommand(
        "vscode-python-poetry.addDevPackageLegacy",
        extensionService.addDevPackageLegacy
      ),
      commands.registerCommand(
        "vscode-python-poetry.removePackage",
        extensionService.removePackage
      ),
      commands.registerCommand(
        "vscode-python-poetry.removeDevPackageLegacy",
        extensionService.removeDevPackageLegacy
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackages",
        extensionService.updatePackages
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackagesWithOptions",
        extensionService.updatePackagesWithOptions
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackagesNoDev",
        extensionService.updatePackagesNoDev
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackage",
        extensionService.updatePackage
      ),
      commands.registerCommand(
        "vscode-python-poetry.lockPackages",
        extensionService.lockPackages
      ),
      commands.registerCommand(
        "vscode-python-poetry.lockPackagesNoUpdate",
        extensionService.lockPackagesNoUpdate
      ),
    ]
  );
}

export function deactivate(): void {
  // This method is called when the extension is deactivated
}
