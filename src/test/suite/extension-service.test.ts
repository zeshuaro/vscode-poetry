import { afterEach, beforeEach } from "mocha";
import {
  SinonStubbedInstance,
  assert,
  createStubInstance,
  restore,
} from "sinon";
import { ExtensionService } from "../../extension-service";
import { PoetryService } from "../../poetry-service";
import { PoetryCommand } from "../../types";

suite("ExtensionService", () => {
  let poetryService: SinonStubbedInstance<PoetryService>;
  let sut: ExtensionService;

  beforeEach(() => {
    poetryService = createStubInstance(PoetryService);
    sut = new ExtensionService(poetryService);
  });

  afterEach(() => {
    restore();
  });

  test("install packages", async () => {
    await sut.installPackages();
    assert.calledOnce(poetryService.installPackages);
  });

  test("install packages with options", async () => {
    await sut.installPackagesWithOptions();
    assert.calledOnceWithExactly(poetryService.installPackages, {
      askOptions: true,
    });
  });

  test("add package", async () => {
    await sut.addPackage();
    assert.calledOnceWithExactly(poetryService.managePackages, {
      command: PoetryCommand.add,
      askGroup: true,
    });
  });

  test("add dev package", async () => {
    await sut.addDevPackageLegacy();
    assert.calledOnceWithExactly(poetryService.managePackages, {
      command: PoetryCommand.add,
      isDev: true,
    });
  });

  test("remove package", async () => {
    await sut.removePackage();
    assert.calledOnceWithExactly(poetryService.managePackages, {
      command: PoetryCommand.remove,
      askGroup: true,
    });
  });

  test("remove dev package", async () => {
    await sut.removeDevPackageLegacy();
    assert.calledOnceWithExactly(poetryService.managePackages, {
      command: PoetryCommand.remove,
      isDev: true,
    });
  });

  test("update packages", async () => {
    await sut.updatePackages();
    assert.calledOnce(poetryService.updatePackages);
  });

  test("update packages with options", async () => {
    await sut.updatePackagesWithOptions();
    assert.calledOnceWithExactly(poetryService.updatePackages, {
      askOptions: true,
    });
  });

  test("update packages no dev", async () => {
    await sut.updatePackagesNoDev();
    assert.calledOnceWithExactly(poetryService.updatePackages, {
      noDev: true,
    });
  });

  test("update package", async () => {
    await sut.updatePackage();
    assert.calledOnceWithExactly(poetryService.updatePackages, {
      askPackageName: true,
    });
  });

  test("lock packages", () => {
    sut.lockPackages();
    assert.calledOnce(poetryService.lockPackages);
  });

  test("lock packages no update", () => {
    sut.lockPackagesNoUpdate();
    assert.calledOnceWithExactly(poetryService.lockPackages, {
      noUpdate: true,
    });
  });
});
