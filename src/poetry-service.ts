import * as vscode from "vscode";

export class PoetryService {
  terminal?: vscode.Terminal;

  promptOptions = async (items: string[]) =>
    await vscode.window.showQuickPick(items, {
      canPickMany: true,
      title: "Select one or more options to run with the command",
      placeHolder: "Press space to select/unselect an option",
    });

  promptPackageName = async () =>
    await vscode.window.showInputBox({
      placeHolder: "Package name, git URL or local path",
      title: "Enter a package name, git URL or local path",
    });

  runPoetry = (args: string[]): void => {
    const terminal = this.getTerminal();
    terminal.sendText(`poetry ${args.join(" ")}`);
  };

  private getTerminal = () => {
    if (!this.terminal || this.terminal.exitStatus) {
      this.terminal = vscode.window.createTerminal();
    }
    return this.terminal;
  };
}

export default new PoetryService();
