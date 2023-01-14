import { afterEach, beforeEach } from "mocha";
import { restore, stub, assert, createStubInstance } from "sinon";
import { Uri } from "vscode";
import { CacheService } from "../../cache-service";
import { ExtensionService } from "../../extension-service";
import { PoetryService } from "../../poetry-service";
import { PoetryCommand } from "../../types";

suite("ExtensionService", () => {
  let globalStoragePath: Uri;
  let cacheService: CacheService;
  let poetryService: PoetryService;
  let extensionService: ExtensionService;

  beforeEach(() => {
    globalStoragePath = createStubInstance(Uri);
    cacheService = new CacheService(globalStoragePath);
    poetryService = new PoetryService(cacheService);
    extensionService = new ExtensionService(poetryService);
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
    await extensionService.installPackages();
    assert.calledOnce(installPackages);
  });

  test("install packages with options", async () => {
    const installPackages = mockInstallPackages();
    await extensionService.installPackagesWithOptions();
    assert.calledWith(installPackages, { askOptions: true });
  });

  test("add package", async () => {
    const managePackage = mockManagePackage();
    await extensionService.addPackage();
    assert.calledWith(managePackage, {
      command: PoetryCommand.add,
      askGroup: true,
    });
  });

  test("add dev package", async () => {
    const managePackage = mockManagePackage();
    await extensionService.addDevPackageLegacy();
    assert.calledWith(managePackage, {
      command: PoetryCommand.add,
      isDev: true,
    });
  });

  test("remove package", async () => {
    const managePackage = mockManagePackage();
    await extensionService.removePackage();
    assert.calledWith(managePackage, {
      command: PoetryCommand.remove,
      askGroup: true,
    });
  });

  test("remove dev package", async () => {
    const managePackage = mockManagePackage();
    await extensionService.removeDevPackageLegacy();
    assert.calledWith(managePackage, {
      command: PoetryCommand.remove,
      isDev: true,
    });
  });

  test("update packages", async () => {
    const updatePackages = mockUpdatePackages();
    await extensionService.updatePackages();
    assert.calledOnce(updatePackages);
  });

  test("update packages with options", async () => {
    const updatePackages = mockUpdatePackages();
    await extensionService.updatePackagesWithOptions();
    assert.calledWith(updatePackages, { askOptions: true });
  });

  test("update packages no dev", async () => {
    const updatePackages = mockUpdatePackages();
    await extensionService.updatePackagesNoDev();
    assert.calledWith(updatePackages, {
      noDev: true,
    });
  });

  test("update package", async () => {
    const updatePackages = mockUpdatePackages();
    await extensionService.updatePackage();
    assert.calledWith(updatePackages, {
      askPackageName: true,
    });
  });

  test("lock packages", () => {
    const lockPackages = mockLockPackages();
    extensionService.lockPackages();
    assert.calledOnce(lockPackages);
  });

  test("lock packages no update", () => {
    const lockPackages = mockLockPackages();
    extensionService.lockPackagesNoUpdate();
    assert.calledWith(lockPackages, {
      noUpdate: true,
    });
  });
});
