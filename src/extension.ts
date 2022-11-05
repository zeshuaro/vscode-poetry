import { commands, ExtensionContext } from "vscode";
import poetryCommands from "./commands";

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    ...[
      commands.registerCommand(
        "vscode-python-poetry.installPackages",
        poetryCommands.installPackages
      ),
      commands.registerCommand(
        "vscode-python-poetry.installPackagesWithOptions",
        poetryCommands.installPackagesWithOptions
      ),
      commands.registerCommand(
        "vscode-python-poetry.addPackage",
        poetryCommands.addPackage
      ),
      commands.registerCommand(
        "vscode-python-poetry.addDevPackageLegacy",
        poetryCommands.addDevPackageLegacy
      ),
      commands.registerCommand(
        "vscode-python-poetry.removePackage",
        poetryCommands.removePackage
      ),
      commands.registerCommand(
        "vscode-python-poetry.removeDevPackageLegacy",
        poetryCommands.removeDevPackageLegacy
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackages",
        poetryCommands.updatePackages
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackagesWithOptions",
        poetryCommands.updatePackagesWithOptions
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackagesNoDev",
        poetryCommands.updatePackagesNoDev
      ),
      commands.registerCommand(
        "vscode-python-poetry.updatePackage",
        poetryCommands.updatePackage
      ),
      commands.registerCommand(
        "vscode-python-poetry.lockPackages",
        poetryCommands.lockPackages
      ),
      commands.registerCommand(
        "vscode-python-poetry.lockPackagesNoUpdate",
        poetryCommands.lockPackagesNoUpdate
      ),
    ]
  );
}

export function deactivate(): void {
  // This method is called when the extension is deactivated
}
