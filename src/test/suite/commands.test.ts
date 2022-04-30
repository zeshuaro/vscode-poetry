import { afterEach, before, beforeEach } from "mocha";
import * as sinon from "sinon";
import { Commands } from "../../commands";
import { PoetryService } from "../../poetry-service";
import { PoetryCommand } from "../../types";

suite("Commands", () => {
  let poetryService: PoetryService;
  let commands: Commands;
  let packageName: string;
  let runPoetry: sinon.SinonStub;

  before(() => {
    packageName = "packageName";
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

  const verifyNotCalled = (promptPackageName: sinon.SinonStub) => {
    sinon.assert.calledOnce(promptPackageName);
    sinon.assert.notCalled(runPoetry);
  };

  test("adds package", async () => {
    const promptPackageName = mockPromptPackageName();

    await commands.addPackage();

    sinon.assert.calledOnce(promptPackageName);
    sinon.assert.calledWith(runPoetry, [PoetryCommand.add, packageName]);
  });

  test("adds package without package name", async () => {
    const promptPackageName = mockPromptPackageNameUndefined();
    await commands.addPackage();
    verifyNotCalled(promptPackageName);
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
    verifyNotCalled(promptPackageName);
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
    verifyNotCalled(promptPackageName);
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
    verifyNotCalled(promptPackageName);
  });
});
