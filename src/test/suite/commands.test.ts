import { afterEach, before, beforeEach } from "mocha";
import * as sinon from "sinon";
import { Commands } from "../../commands";
import { installOptions } from "../../poetry-options";
import { PoetryService } from "../../poetry-service";
import { PoetryCommand, PoetryOption } from "../../types";

suite("Commands", () => {
  let poetryService: PoetryService;
  let commands: Commands;
  let packageName: string;
  let options: PoetryOption[];
  let runPoetry: sinon.SinonStub;

  before(() => {
    packageName = "packageName";
    options = installOptions;
  });

  beforeEach(() => {
    poetryService = new PoetryService();
    commands = new Commands(poetryService);
    runPoetry = sinon.stub(poetryService, "runPoetry");
  });

  afterEach(() => {
    sinon.restore();
  });

  const mockPromptPackageName = () =>
    sinon
      .stub(poetryService, "promptPackageName")
      .callsFake(() => Promise.resolve(packageName));

  const mockPromptPackageNameUndefined = () =>
    sinon
      .stub(poetryService, "promptPackageName")
      .callsFake(() => Promise.resolve(undefined));

  const verifyrunPoetryNotCalled = (promptPackageName: sinon.SinonStub) => {
    sinon.assert.calledOnce(promptPackageName);
    sinon.assert.notCalled(runPoetry);
  };

  test("installs packages", async () => {
    await commands.installPackages();
    sinon.assert.calledWith(runPoetry, [PoetryCommand.install]);
  });

  test("installs packages with options", async () => {
    const promptOptions = sinon
      .stub(poetryService, "promptOptions")
      .callsFake(() =>
        Promise.resolve(options.map((option) => option.description))
      );

    await commands.installPackagesWithOptions();

    sinon.assert.calledOnce(promptOptions);
    sinon.assert.calledWith(runPoetry, [
      PoetryCommand.install,
      ...options.map((option) => option.option),
    ]);
  });

  test("installs packages with unknown options", async () => {
    const promptOptions = sinon
      .stub(poetryService, "promptOptions")
      .callsFake(() => Promise.resolve(["a", "b"]));

    await commands.installPackagesWithOptions();

    sinon.assert.calledOnce(promptOptions);
    sinon.assert.calledWith(runPoetry, [PoetryCommand.install]);
  });

  test("installs packages without selecting options", async () => {
    const promptOptions = sinon
      .stub(poetryService, "promptOptions")
      .callsFake(() => Promise.resolve(undefined));

    await commands.installPackagesWithOptions();

    sinon.assert.calledOnce(promptOptions);
    sinon.assert.notCalled(runPoetry);
  });

  test("adds package", async () => {
    const promptPackageName = mockPromptPackageName();

    await commands.addPackage();

    sinon.assert.calledOnce(promptPackageName);
    sinon.assert.calledWith(runPoetry, [PoetryCommand.add, packageName]);
  });

  test("adds package without package name", async () => {
    const promptPackageName = mockPromptPackageNameUndefined();
    await commands.addPackage();
    verifyrunPoetryNotCalled(promptPackageName);
  });

  test("adds dev package", async () => {
    const promptPackageName = mockPromptPackageName();

    await commands.addDevPackage();

    sinon.assert.calledOnce(promptPackageName);
    sinon.assert.calledWith(runPoetry, [
      PoetryCommand.add,
      packageName,
      "--dev",
    ]);
  });

  test("adds dev package without package name", async () => {
    const promptPackageName = mockPromptPackageNameUndefined();
    await commands.addDevPackage();
    verifyrunPoetryNotCalled(promptPackageName);
  });

  test("removes package", async () => {
    const promptPackageName = mockPromptPackageName();

    await commands.removePackage();

    sinon.assert.calledOnce(promptPackageName);
    sinon.assert.calledWith(runPoetry, [PoetryCommand.remove, packageName]);
  });

  test("removes package without package name", async () => {
    const promptPackageName = mockPromptPackageNameUndefined();
    await commands.removePackage();
    verifyrunPoetryNotCalled(promptPackageName);
  });

  test("removes dev package", async () => {
    const promptPackageName = mockPromptPackageName();

    await commands.removeDevPackage();

    sinon.assert.calledOnce(promptPackageName);
    sinon.assert.calledWith(runPoetry, [
      PoetryCommand.remove,
      packageName,
      "--dev",
    ]);
  });

  test("removes dev package without package name", async () => {
    const promptPackageName = mockPromptPackageNameUndefined();
    await commands.removeDevPackage();
    verifyrunPoetryNotCalled(promptPackageName);
  });

  test("updates packages", async () => {
    await commands.updatePackages();
    sinon.assert.calledWith(runPoetry, [PoetryCommand.update]);
  });

  test("updates packages without dev", async () => {
    await commands.updatePackagesNoDev();
    sinon.assert.calledWith(runPoetry, [PoetryCommand.update, "--no-dev"]);
  });

  test("updates package", async () => {
    const promptPackageName = mockPromptPackageName();

    await commands.updatePackage();

    sinon.assert.calledOnce(promptPackageName);
    sinon.assert.calledWith(runPoetry, [PoetryCommand.update, packageName]);
  });

  test("updates package without package name", async () => {
    const promptPackageName = mockPromptPackageNameUndefined();
    await commands.updatePackage();
    verifyrunPoetryNotCalled(promptPackageName);
  });
});
