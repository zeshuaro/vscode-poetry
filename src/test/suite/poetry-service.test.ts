import { afterEach, before, beforeEach } from "mocha";
import {
  assert,
  createStubInstance,
  restore,
  SinonStub,
  SinonStubbedInstance,
  stub,
} from "sinon";
import { Terminal, window } from "vscode";
import { CacheService } from "../../cache-service";
import { PoetryService } from "../../poetry-service";
import { PoetryCommand, PoetryOption } from "../../types";

suite("PoetryService", () => {
  let cacheService: SinonStubbedInstance<CacheService>;
  let sut: PoetryService;
  let terminal: Terminal;
  let sendText: SinonStub;
  let createTerminal: SinonStub;
  let showQuickPick: SinonStub;
  let showInputBox: SinonStub;
  let command: PoetryCommand;
  let packageName: string;
  let group: string;
  let optionValue: string;

  before(() => {
    command = PoetryCommand.add;
    packageName = "packageName";
    group = "group";
    optionValue = "optionValue";
  });

  beforeEach(() => {
    cacheService = createStubInstance(CacheService);

    terminal = <Terminal>{
      sendText: (_text: string, _addNewLine?: boolean) => {},
      exitStatus: undefined,
    };
    sendText = stub(terminal, "sendText");
    createTerminal = stub(window, "createTerminal").returns(terminal);

    sut = new PoetryService(cacheService);
  });

  afterEach(() => {
    restore();
  });

  test("install packages", async () => {
    await sut.installPackages();
    assert.calledWith(sendText, "poetry install");
  });

  test("install packages ask options", async () => {
    const opts = PoetryService.installOptions;
    mockShowQuickPick(opts.map((opt) => opt.description));
    showInputBox = stub(window, "showInputBox").returns(
      Promise.resolve(optionValue)
    );

    await sut.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledWith(
      sendText,
      `poetry install ${getMappedPoetryOptions(opts)}`
    );
  });

  test("install packages ask options without selections", async () => {
    mockShowQuickPick(undefined);

    await sut.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledWith(sendText, "poetry install");
  });

  test("install packages ask options prompt undefined", async () => {
    const opts = PoetryService.installOptions;
    mockShowQuickPick(opts.map((opt) => opt.description));
    mockShowInputBox(undefined);

    await sut.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledWith(
      sendText,
      `poetry install ${opts
        .filter((opt) => !("promptDescription" in opt))
        .map((opt) => opt.value)
        .join(" ")}`
    );
  });

  test("install packages unknown option", async () => {
    mockShowQuickPick(["clearlyRandomOption"]);

    await sut.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledWith(sendText, "poetry install");
  });

  test("manage packages", async () => {
    mockShowInputBox(packageName);

    await sut.managePackages({ command });

    assert.calledWith(sendText, `poetry ${command} ${packageName}`);
    assert.calledOnce(showInputBox);
  });

  test("manage packages without package name", async () => {
    mockShowInputBox(undefined);

    await sut.managePackages({ command });

    assert.notCalled(sendText);
    assert.calledOnce(showInputBox);
  });

  test("manage dev packages", async () => {
    mockShowInputBox(packageName);

    await sut.managePackages({ command, isDev: true });

    assert.calledWith(sendText, `poetry ${command} ${packageName} --dev`);
    assert.calledOnce(showInputBox);
  });

  test("manage packages with group", async () => {
    mockShowInputBox(packageName, group);

    await sut.managePackages({ command, askGroup: true });

    assert.calledWith(
      sendText,
      `poetry ${command} ${packageName} --group ${group}`
    );
    assert.calledTwice(showInputBox);
  });

  test("manage packages with undefined group", async () => {
    mockShowInputBox(packageName, undefined);

    await sut.managePackages({ command, askGroup: true });

    assert.notCalled(sendText);
    assert.calledTwice(showInputBox);
  });

  test("manage packages with empty string group", async () => {
    mockShowInputBox(packageName, "");

    await sut.managePackages({ command, askGroup: true });

    assert.calledWith(sendText, `poetry ${command} ${packageName}`);
    assert.calledTwice(showInputBox);
  });

  test("update packages", async () => {
    await sut.updatePackages();
    assert.calledWith(sendText, "poetry update");
  });

  test("update packages ask options", async () => {
    const opts = PoetryService.updateOptions;
    mockShowQuickPick(opts.map((opt) => opt.description));
    showInputBox = stub(window, "showInputBox").returns(
      Promise.resolve(optionValue)
    );

    await sut.updatePackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledWith(
      sendText,
      `poetry update ${getMappedPoetryOptions(opts)}`
    );
  });

  test("update packages ask options without selections", async () => {
    mockShowQuickPick(undefined);

    await sut.updatePackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledWith(sendText, "poetry update");
  });

  test("update packages no dev", async () => {
    await sut.updatePackages({ noDev: true });
    assert.calledWith(sendText, "poetry update --no-dev");
  });

  test("update packages with package name", async () => {
    mockShowInputBox(packageName);

    await sut.updatePackages({ askPackageName: true });

    assert.calledWith(sendText, `poetry update ${packageName}`);
    assert.calledOnce(showInputBox);
  });

  test("update packages without package name", async () => {
    mockShowInputBox(undefined);

    await sut.updatePackages({ askPackageName: true });

    assert.notCalled(sendText);
    assert.calledOnce(showInputBox);
  });

  test("lock packages", () => {
    sut.lockPackages();
    assert.calledWith(sendText, "poetry lock");
  });

  test("lock packages no update", () => {
    sut.lockPackages({ noUpdate: true });
    assert.calledWith(sendText, "poetry lock --no-update");
  });

  test("terminal active", () => {
    sut.lockPackages();
    sut.lockPackages();

    assert.calledOnce(createTerminal);
  });

  test("terminal inactive", () => {
    (window.createTerminal as unknown as SinonStub).restore();
    terminal = <Terminal>{
      sendText: (_text: string, _addNewLine?: boolean) => {},
      exitStatus: {},
    };
    const createTerminal = stub(window, "createTerminal").returns(terminal);

    sut.lockPackages();
    sut.lockPackages();

    assert.calledTwice(createTerminal);
  });

  function mockShowQuickPick(values: string[] | undefined) {
    showQuickPick = stub(window, "showQuickPick") as unknown as SinonStub<
      [items: string[]],
      Thenable<string[] | undefined>
    >;
    showQuickPick.callsFake(() => Promise.resolve(values));
  }

  function mockShowInputBox(...values: Array<string | undefined>) {
    showInputBox = stub(window, "showInputBox");
    values.forEach((value, index) => {
      showInputBox.onCall(index).returns(value);
    });
  }

  function getMappedPoetryOptions(options: PoetryOption[]) {
    return options
      .map((opt) => {
        if (opt.promptDescription) {
          return `${opt.value} ${optionValue}`;
        }
        return opt.value;
      })
      .join(" ");
  }
});
