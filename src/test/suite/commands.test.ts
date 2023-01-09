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

  function mockInstallPackages() {
    return stub(poetryService, "installPackages");
  }

  function mockManagePackage() {
    return stub(poetryService, "managePackages");
  }

  function mockUpdatePackages() {
    return stub(poetryService, "updatePackages");
  }

  function mockLockPackages() {
    return stub(poetryService, "lockPackages");
  }

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
    assert.calledWith(managePackage, {
      command: PoetryCommand.add,
      askGroup: true,
    });
  });

  test("add dev package", async () => {
    const managePackage = mockManagePackage();
    await commands.addDevPackageLegacy();
    assert.calledWith(managePackage, {
      command: PoetryCommand.add,
      isDev: true,
    });
  });

  test("remove package", async () => {
    const managePackage = mockManagePackage();
    await commands.removePackage();
    assert.calledWith(managePackage, {
      command: PoetryCommand.remove,
      askGroup: true,
    });
  });

  test("remove dev package", async () => {
    const managePackage = mockManagePackage();
    await commands.removeDevPackageLegacy();
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

  test("update packages with options", async () => {
    const updatePackages = mockUpdatePackages();
    await commands.updatePackagesWithOptions();
    assert.calledWith(updatePackages, { askOptions: true });
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
