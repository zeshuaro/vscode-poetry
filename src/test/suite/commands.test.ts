import { afterEach, beforeEach } from "mocha";
import { restore, stub, assert } from "sinon";
import { Commands } from "../../commands";
import { PoetryService } from "../../poetry-service";
import { PoetryCommand } from "../../types";

suite("Commands", () => {
  let poetryService: PoetryService;
  let commands: Commands;

  beforeEach(() => {
    poetryService = new PoetryService();
    commands = new Commands(poetryService);
  });

  afterEach(() => {
    restore();
  });

  const mockInstallPackages = () => stub(poetryService, "installPackages");

  const mockManagePackage = () => stub(poetryService, "managePackages");

  const mockUpdatePackages = () => stub(poetryService, "updatePackages");

  const mockLockPackages = () => stub(poetryService, "lockPackages");

  test("install packages", async () => {
    const installPackages = mockInstallPackages();
    await commands.installPackages();
    assert.calledOnce(installPackages);
  });

  test("install packages with options", async () => {
    const installPackages = mockInstallPackages();
    await commands.installPackagesWithOptions();
    assert.calledWith(installPackages, { askOptions: true });
  });

  test("add package", async () => {
    const managePackage = mockManagePackage();
    await commands.addPackage();
    assert.calledWith(managePackage, { command: PoetryCommand.add });
  });

  test("add dev package", async () => {
    const managePackage = mockManagePackage();
    await commands.addDevPackage();
    assert.calledWith(managePackage, {
      command: PoetryCommand.add,
      isDev: true,
    });
  });

  test("remove package", async () => {
    const managePackage = mockManagePackage();
    await commands.removePackage();
    assert.calledWith(managePackage, { command: PoetryCommand.remove });
  });

  test("remove dev package", async () => {
    const managePackage = mockManagePackage();
    await commands.removeDevPackage();
    assert.calledWith(managePackage, {
      command: PoetryCommand.remove,
      isDev: true,
    });
  });

  test("update packages", async () => {
    const updatePackages = mockUpdatePackages();
    await commands.updatePackages();
    assert.calledOnce(updatePackages);
  });

  test("update packages no dev", async () => {
    const updatePackages = mockUpdatePackages();
    await commands.updatePackagesNoDev();
    assert.calledWith(updatePackages, {
      noDev: true,
    });
  });

  test("update package", async () => {
    const updatePackages = mockUpdatePackages();
    await commands.updatePackage();
    assert.calledWith(updatePackages, {
      askPackageName: true,
    });
  });

  test("lock packages", () => {
    const lockPackages = mockLockPackages();
    commands.lockPackages();
    assert.calledOnce(lockPackages);
  });

  test("lock packages no update", () => {
    const lockPackages = mockLockPackages();
    commands.lockPackagesNoUpdate();
    assert.calledWith(lockPackages, {
      noUpdate: true,
    });
  });
});
