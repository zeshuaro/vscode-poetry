import assert = require("assert");
import { afterEach, beforeEach } from "mocha";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { PoetryService } from "../../poetry-service";

suite("PoetryService", () => {
  let poetryService: PoetryService;
  let terminal: vscode.Terminal;

  beforeEach(() => {
    poetryService = new PoetryService();
    terminal = <vscode.Terminal>{};
  });

  afterEach(() => {
    sinon.restore();
  });

  test("prompts options", async () => {
    const options = ["a", "b", "c"];
    const showInputBox = sinon.stub(vscode.window, "showQuickPick");

    await poetryService.promptOptions(options);

    sinon.assert.calledOnce(showInputBox);
  });

  test("prompts package name", async () => {
    const packageName = "package";
    const showInputBox = sinon
      .stub(vscode.window, "showInputBox")
      .callsFake(() => Promise.resolve(packageName));

    const actual = await poetryService.promptPackageName();

    sinon.assert.calledOnce(showInputBox);
    assert.strictEqual(actual, packageName);
  });

  test("runs poetry", () => {
    terminal.sendText = sinon.stub();
    const createTerminal = sinon
      .stub(vscode.window, "createTerminal")
      .callsFake(() => terminal);

    poetryService.runPoetry(["add requests"]);

    sinon.assert.calledOnce(createTerminal);
    sinon.assert.calledWith(
      <sinon.SinonStub>terminal.sendText,
      "poetry add requests"
    );
  });
});
