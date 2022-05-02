import * as vscode from "vscode";
import commands from "./commands";

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    ...[
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
    ]
  );
}

export function deactivate(): void {
  // This method is called when the extension is deactivated
}
