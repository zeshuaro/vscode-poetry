import { afterEach, beforeEach } from "mocha";
import { restore, stub, assert } from "sinon";
import { Memento } from "vscode";
import { CacheService } from "../../cache-service";

suite("Commands", () => {
  const packages = new Set(["packageA", "packageB"]);
  const emptyPackages = new Set();

  let globalState: Memento;
  let cacheService: CacheService;

  beforeEach(() => {
    globalState = <Memento>{
      get: <T>(_key: string, _defaultValue: T) => {},
      update: (_key: string, _value: any) => {},
    };
    cacheService = new CacheService(globalState);
  });

  afterEach(() => {
    restore();
  });

  test("get packages", () => {
    const get = stub(globalState, "get").returns(packages);

    const actual = cacheService.getPackages();

    assert.match(actual, packages);
    assert.calledWith(get, "packages", emptyPackages);
  });

  test("update packages", async () => {
    const newPackages = new Set(["newPackage"]);
    stub(cacheService, "getPackages").returns(packages);
    const update = stub(globalState, "update");

    await cacheService.updatePackages(newPackages);

    const expectedPackages = new Set([...packages, ...newPackages]);
    assert.calledWith(update, "packages", expectedPackages);
  });
});
