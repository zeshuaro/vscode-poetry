import { afterEach, beforeEach } from "mocha";
import {
  SinonStub,
  SinonStubbedInstance,
  assert,
  createStubInstance,
  restore,
  stub,
} from "sinon";
import { Terminal, window } from "vscode";
import { PoetryService } from "../../poetry-service";
import { PypiService } from "../../pypi";
import { PoetryCommand, PoetryOption } from "../../types";

suite("PoetryService", () => {
  const command = PoetryCommand.add;
  const packageName = "packageName";
  const group = "group";
  const optionValue = "optionValue";

  let pypiService: SinonStubbedInstance<PypiService>;
  let sut: PoetryService;
  let terminal: Terminal;
  let sendText: SinonStub;
  let createTerminal: SinonStub;
  let show: SinonStub;

  beforeEach(() => {
    terminal = <Terminal>{
      sendText: (_text: string, _addNewLine?: boolean) => {},
      show: () => {},
      exitStatus: undefined,
    };
    sendText = stub(terminal, "sendText");
    show = stub(terminal, "show");

    createTerminal = stub(window, "createTerminal").returns(terminal);

    pypiService = createStubInstance(PypiService);
    sut = new PoetryService(pypiService);
  });

  afterEach(() => {
    restore();
  });

  test("install packages", async () => {
    await sut.installPackages();
    assert.calledOnce(show);
    assert.calledWith(sendText, "poetry install");
  });

  test("install packages ask options", async () => {
    const opts = PoetryService.installOptions;
    const numExtraPompts = opts.filter((opt) => opt.promptDescription).length;

    const showQuickPick = mockShowQuickPick(opts.map((opt) => opt.description));
    const showInputBox = mockShowInputBox(
      ...Array<string>(numExtraPompts).fill(optionValue)
    );

    await sut.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.callCount(showInputBox, numExtraPompts);
    assert.calledOnce(show);
    assert.calledWith(
      sendText,
      `poetry install ${getMappedPoetryOptions(opts)}`
    );
  });

  test("install packages ask options without selections", async () => {
    const showQuickPick = mockShowQuickPick(undefined);

    await sut.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledOnce(show);
    assert.calledWith(sendText, "poetry install");
  });

  test("install packages ask options prompt undefined", async () => {
    const opts = PoetryService.installOptions;
    const numExtraPompts = opts.filter((opt) => opt.promptDescription).length;

    const showQuickPick = mockShowQuickPick(opts.map((opt) => opt.description));
    const showInputBox = mockShowInputBox(
      ...Array<undefined>(numExtraPompts).fill(undefined)
    );

    await sut.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.callCount(showInputBox, numExtraPompts);
    assert.calledOnce(show);
    assert.calledWith(
      sendText,
      `poetry install ${opts
        .filter((opt) => !("promptDescription" in opt))
        .map((opt) => opt.value)
        .join(" ")}`
    );
  });

  test("install packages unknown option", async () => {
    const showQuickPick = mockShowQuickPick(["clearlyRandomOption"]);

    await sut.installPackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledOnce(show);
    assert.calledWith(sendText, "poetry install");
  });

  test("add packages", async () => {
    const promptPackageNameWithSearch =
      mockPromptPackageNameWithSearch(packageName);

    await sut.managePackages({ command });

    assert.calledOnce(show);
    assert.calledWith(sendText, `poetry ${command} ${packageName}`);
    assert.calledOnce(promptPackageNameWithSearch);
  });

  test("remove packages", async () => {
    const command = PoetryCommand.remove;
    const showInputBox = mockShowInputBox(packageName);

    await sut.managePackages({ command });

    assert.calledOnce(show);
    assert.calledWith(sendText, `poetry ${command} ${packageName}`);
    assert.calledOnce(showInputBox);
  });

  test("manage packages without package name", async () => {
    const promptPackageNameWithSearch =
      mockPromptPackageNameWithSearch(undefined);

    await sut.managePackages({ command });

    assert.notCalled(show);
    assert.notCalled(sendText);
    assert.calledOnce(promptPackageNameWithSearch);
  });

  test("manage dev packages", async () => {
    const promptPackageNameWithSearch =
      mockPromptPackageNameWithSearch(packageName);

    await sut.managePackages({ command, isDev: true });

    assert.calledOnce(show);
    assert.calledWith(sendText, `poetry ${command} ${packageName} --dev`);
    assert.calledOnce(promptPackageNameWithSearch);
  });

  test("manage packages with group", async () => {
    const promptPackageNameWithSearch =
      mockPromptPackageNameWithSearch(packageName);
    const showInputBox = mockShowInputBox(group);

    await sut.managePackages({ command, askGroup: true });

    assert.calledOnce(show);
    assert.calledWith(
      sendText,
      `poetry ${command} ${packageName} --group ${group}`
    );
    assert.calledOnce(promptPackageNameWithSearch);
    assert.calledOnce(showInputBox);
  });

  test("manage packages with undefined group", async () => {
    const promptPackageNameWithSearch =
      mockPromptPackageNameWithSearch(packageName);
    const showInputBox = mockShowInputBox(undefined);

    await sut.managePackages({ command, askGroup: true });

    assert.notCalled(show);
    assert.notCalled(sendText);
    assert.calledOnce(promptPackageNameWithSearch);
    assert.calledOnce(showInputBox);
  });

  test("manage packages with empty string group", async () => {
    const promptPackageNameWithSearch =
      mockPromptPackageNameWithSearch(packageName);
    const showInputBox = mockShowInputBox("");

    await sut.managePackages({ command, askGroup: true });

    assert.calledOnce(show);
    assert.calledWith(sendText, `poetry ${command} ${packageName}`);
    assert.calledOnce(promptPackageNameWithSearch);
    assert.calledOnce(showInputBox);
  });

  test("update packages", async () => {
    await sut.updatePackages();

    assert.calledOnce(show);
    assert.calledWith(sendText, "poetry update");
  });

  test("update packages ask options", async () => {
    const opts = PoetryService.updateOptions;
    const numExtraPompts = opts.filter((opt) => opt.promptDescription).length;

    const showQuickPick = mockShowQuickPick(opts.map((opt) => opt.description));
    const showInputBox = mockShowInputBox(
      ...Array<string>(numExtraPompts).fill(optionValue)
    );

    await sut.updatePackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.callCount(showInputBox, numExtraPompts);
    assert.calledOnce(show);
    assert.calledWith(
      sendText,
      `poetry update ${getMappedPoetryOptions(opts)}`
    );
  });

  test("update packages ask options without selections", async () => {
    const showQuickPick = mockShowQuickPick(undefined);

    await sut.updatePackages({ askOptions: true });

    assert.calledOnce(showQuickPick);
    assert.calledOnce(show);
    assert.calledWith(sendText, "poetry update");
  });

  test("update packages no dev", async () => {
    await sut.updatePackages({ noDev: true });

    assert.calledOnce(show);
    assert.calledWith(sendText, "poetry update --no-dev");
  });

  test("update packages with package name", async () => {
    const showInputBox = mockShowInputBox(packageName);

    await sut.updatePackages({ askPackageName: true });

    assert.calledOnce(show);
    assert.calledWith(sendText, `poetry update ${packageName}`);
    assert.calledOnce(showInputBox);
  });

  test("update packages without package name", async () => {
    const showInputBox = mockShowInputBox(undefined);

    await sut.updatePackages({ askPackageName: true });

    assert.notCalled(show);
    assert.notCalled(sendText);
    assert.calledOnce(showInputBox);
  });

  test("lock packages", () => {
    sut.lockPackages();

    assert.calledOnce(show);
    assert.calledWith(sendText, "poetry lock");
  });

  test("lock packages no update", () => {
    sut.lockPackages({ noUpdate: true });

    assert.calledOnce(show);
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
      show: () => {},
      exitStatus: {},
    };
    const createTerminal = stub(window, "createTerminal").returns(terminal);

    sut.lockPackages();
    sut.lockPackages();

    assert.calledTwice(createTerminal);
  });

  function mockShowQuickPick(values: string[] | undefined) {
    const showQuickPick = stub(window, "showQuickPick") as unknown as SinonStub<
      [items: string[]],
      Thenable<string[] | undefined>
    >;
    showQuickPick.returns(Promise.resolve(values));

    return showQuickPick;
  }

  function mockShowInputBox(...values: Array<string | undefined>) {
    const showInputBox = stub(window, "showInputBox");
    values.forEach((value, index) => {
      showInputBox.onCall(index).returns(Promise.resolve(value));
    });

    return showInputBox;
  }

  function mockPromptPackageNameWithSearch(value: string | undefined) {
    return stub(sut, <any>"promptPackageNameWithSearch").returns(value);
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
