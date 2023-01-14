import { afterEach, beforeEach } from "mocha";
import { restore, stub, assert, createStubInstance, SinonStub } from "sinon";
import { FileSystem, Uri, workspace } from "vscode";
import { CacheService } from "../../cache-service";
import { CachePackageData } from "../../types";

suite("CacheService", () => {
  const packagesCacheName = "packages-cache.json";
  const textEncoder = new TextEncoder();

  const cachePackageList: CachePackageData = {
    packages: [{ name: "packageA" }, { name: "packageB" }],
  };
  const cachePackageListBytes = textEncoder.encode(
    JSON.stringify(cachePackageList)
  );

  const newPackages = [{ name: "packageB" }, { name: "packageC" }];
  const newCachePackageList: CachePackageData = {
    packages: [
      { name: "packageA" },
      { name: "packageB" },
      { name: "packageC" },
    ],
  };
  const newCachePackageListBytes = textEncoder.encode(
    JSON.stringify(newCachePackageList)
  );

  let packagesCacheUri: Uri;
  let fs: FileSystem;
  let readFile: SinonStub;
  let writeFile: SinonStub;
  let joinPath: SinonStub;

  let globalStoragePath: Uri;
  let sut: CacheService;

  beforeEach(() => {
    packagesCacheUri = createStubInstance(Uri);
    fs = <FileSystem>{
      readFile: (_uri: Uri) => {},
      writeFile: (_uri: Uri, _content: Uint8Array) => {},
    };

    readFile = stub(fs, "readFile");
    writeFile = stub(fs, "writeFile");
    stub(workspace, "fs").value(fs);
    joinPath = stub(Uri, "joinPath").returns(packagesCacheUri);

    globalStoragePath = createStubInstance(Uri);
    sut = new CacheService(globalStoragePath);
  });

  afterEach(() => {
    restore();
  });

  test("get packages", async () => {
    readFile.returns(Promise.resolve(cachePackageListBytes));

    const actual = await sut.getPackages();

    assert.match(actual, cachePackageList);
    assert.calledOnceWithExactly(readFile, packagesCacheUri);
    assert.calledOnceWithExactly(
      joinPath,
      globalStoragePath,
      packagesCacheName
    );
  });

  test("get packages error", async () => {
    readFile.throws();

    const actual = await sut.getPackages();

    assert.match(actual, { packages: [] });
    assert.calledOnceWithExactly(readFile, packagesCacheUri);
    assert.calledOnceWithExactly(
      joinPath,
      globalStoragePath,
      packagesCacheName
    );
  });

  test("update packages", async () => {
    const getPackages = stub(sut, "getPackages").returns(
      Promise.resolve(cachePackageList)
    );

    await sut.updatePackages(newPackages);

    assert.calledOnceWithExactly(
      writeFile,
      packagesCacheUri,
      newCachePackageListBytes
    );
    assert.calledOnce(getPackages);
  });
});
