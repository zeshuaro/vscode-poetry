import * as vscode from "vscode";
import commands from "./commands";

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    ...[
      vscode.commands.registerCommand(
        "vscode-python-poetry.installPackages",
        commands.installPackages
      ),
      vscode.commands.registerCommand(
        "vscode-python-poetry.installPackagesWithOptions",
        commands.installPackagesWithOptions
      ),
      vscode.commands.registerCommand(
        "vscode-python-poetry.addPackage",
        commands.addPackage
      ),
      vscode.commands.registerCommand(
        "vscode-python-poetry.addDevPackage",
        commands.addDevPackage
      ),
      vscode.commands.registerCommand(
        "vscode-python-poetry.removePackage",
        commands.removePackage
      ),
      vscode.commands.registerCommand(
        "vscode-python-poetry.removeDevPackage",
        commands.removeDevPackage
      ),
      vscode.commands.registerCommand(
        "vscode-python-poetry.updatePackages",
        commands.updatePackages
      ),
      vscode.commands.registerCommand(
        "vscode-python-poetry.updatePackagesNoDev",
        commands.updatePackagesNoDev
      ),
      vscode.commands.registerCommand(
        "vscode-python-poetry.updatePackage",
        commands.updatePackage
      ),
    ]
  );
}

export function deactivate(): void {
  // This method is called when the extension is deactivated
}
