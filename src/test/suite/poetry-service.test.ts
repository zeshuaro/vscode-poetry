import { afterEach, before, beforeEach } from "mocha";
import { assert, restore, SinonStub, stub } from "sinon";
import { Terminal, window } from "vscode";
import { PoetryService } from "../../poetry-service";
import { PoetryCommand } from "../../types";

suite("PoetryService", () => {
  let poetryService: PoetryService;
  let terminal: Terminal;
  let sendText: SinonStub;
  let showQuickPick: SinonStub;
  let showInputBox: SinonStub;
  let command: PoetryCommand;
  let packageName: string;
  let group: string;

  before(() => {
    command = PoetryCommand.add;
    packageName = "packageName";
    group = "group";
  });

  beforeEach(() => {
    terminal = <Terminal>{
      sendText: (_text: string, _addNewLine?: boolean) => {
        // for mocking
      },
      exitStatus: undefined,
    };
    sendText = stub(terminal, "sendText");
    stub(window, "createTerminal").callsFake(() => terminal);

    poetryService = new PoetryService();
  });

  afterEach(() => {
    restore();
  });

  const mockShowQuickPick = (values: string[] | undefined) => {
    showQuickPick = stub(window, "showQuickPick") as unknown as SinonStub<
      [items: string[]],
      Thenable<string[] | undefined>
    >;
    showQuickPick.callsFake(() => Promise.resolve(values));
  };

  const mockShowInputBox = (...values: Array<string | undefined>) => {
    showInputBox = stub(window, "showInputBox");
    values.forEach((value, index) => {
      showInputBox.onCall(index).returns(value);
    });
  };

  test("install packages", async () => {
    await poetryService.installPackages();
    assert.calledWith(sendText, "poetry install");
  });

  test("install packages ask options", async () => {
    mockShowQuickPick(PoetryService.installOptions.map((e) => e.description));

    await poetryService.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledWith(
      sendText,
      `poetry install ${PoetryService.installOptions
        .map((e) => e.option)
        .join(" ")}`
    );
  });

  test("install packages ask options without selections", async () => {
    mockShowQuickPick(undefined);

    await poetryService.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledWith(sendText, "poetry install");
  });

  test("install packages unknown option", async () => {
    mockShowQuickPick(["clearlyRandomOption"]);

    await poetryService.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledWith(sendText, "poetry install");
  });

  test("manage packages", async () => {
    mockShowInputBox(packageName);

    await poetryService.managePackages({ command });

    assert.calledWith(sendText, `poetry ${command} ${packageName}`);
    assert.calledOnce(showInputBox);
  });

  test("manage packages without package name", async () => {
    mockShowInputBox(undefined);

    await poetryService.managePackages({ command });

    assert.notCalled(sendText);
    assert.calledOnce(showInputBox);
  });

  test("manage dev packages", async () => {
    mockShowInputBox(packageName);

    await poetryService.managePackages({ command, isDev: true });

    assert.calledWith(sendText, `poetry ${command} ${packageName} --dev`);
    assert.calledOnce(showInputBox);
  });

  test("manage packages with group", async () => {
    mockShowInputBox(packageName, group);

    await poetryService.managePackages({ command, askGroup: true });

    assert.calledWith(
      sendText,
      `poetry ${command} ${packageName} --group ${group}`
    );
    assert.calledTwice(showInputBox);
  });

  test("manage packages with undefined group", async () => {
    mockShowInputBox(packageName, undefined);

    await poetryService.managePackages({ command, askGroup: true });

    assert.notCalled(sendText);
    assert.calledTwice(showInputBox);
  });

  test("manage packages with empty string group", async () => {
    mockShowInputBox(packageName, "");

    await poetryService.managePackages({ command, askGroup: true });

    assert.calledWith(sendText, `poetry ${command} ${packageName}`);
    assert.calledTwice(showInputBox);
  });

  test("update packages", async () => {
    await poetryService.updatePackages();
    assert.calledWith(sendText, "poetry update");
  });

  test("update packages no dev", async () => {
    await poetryService.updatePackages({ noDev: true });
    assert.calledWith(sendText, "poetry update --no-dev");
  });

  test("update packages with package name", async () => {
    mockShowInputBox(packageName);

    await poetryService.updatePackages({ askPackageName: true });

    assert.calledWith(sendText, `poetry update ${packageName}`);
    assert.calledOnce(showInputBox);
  });

  test("update packages without package name", async () => {
    mockShowInputBox(undefined);

    await poetryService.updatePackages({ askPackageName: true });

    assert.notCalled(sendText);
    assert.calledOnce(showInputBox);
  });

  test("lock packages", () => {
    poetryService.lockPackages();
    assert.calledWith(sendText, "poetry lock");
  });

  test("lock packages no update", () => {
    poetryService.lockPackages({ noUpdate: true });
    assert.calledWith(sendText, "poetry lock --no-update");
  });
});
