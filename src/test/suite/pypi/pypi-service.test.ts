/* eslint-disable @typescript-eslint/naming-convention */
import { afterEach, beforeEach } from "mocha";
import {
  restore,
  stub,
  assert,
  createStubInstance,
  SinonStub,
  SinonStubbedInstance,
} from "sinon";
import { FileSystem, Uri, workspace } from "vscode";
import { PypiClient, PypiService, PypiSimple } from "../../../pypi";

suite("PypiService", () => {
  const packagesCacheName = "packages-cache.json";
  const textEncoder = new TextEncoder();

  const packages: PypiSimple = {
    meta: {
      "_last-serial": 123,
      "api-version": "v1",
    },
    projects: [{ "_last-serial": 123, name: "packageA" }],
  };
  const packagesBytes = textEncoder.encode(JSON.stringify(packages));

  let packagesCacheUri: Uri;
  let fs: FileSystem;
  let readFile: SinonStub;
  let writeFile: SinonStub;
  let joinPath: SinonStub;

  let pypiClient: SinonStubbedInstance<PypiClient>;
  let globalStoragePath: Uri;

  beforeEach(() => {
    packagesCacheUri = createStubInstance(Uri);
    fs = <FileSystem>{
      readFile: (_uri: Uri) => {},
      writeFile: (_uri: Uri, _content: Uint8Array) => {},
    };

    readFile = stub(fs, "readFile").returns(Promise.resolve(packagesBytes));
    writeFile = stub(fs, "writeFile");
    stub(workspace, "fs").value(fs);
    joinPath = stub(Uri, "joinPath").returns(packagesCacheUri);

    pypiClient = createStubInstance(PypiClient, {
      getPackages: Promise.resolve(packages),
    });

    globalStoragePath = createStubInstance(Uri);
  });

  afterEach(() => {
    restore();
  });

  test("initialize", async () => {
    new PypiService(globalStoragePath, pypiClient);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    assertInitializeSucceed();
  }).timeout(5000);

  test("initialize get cache error", async () => {
    readFile.throws();

    new PypiService(globalStoragePath, pypiClient);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    assertInitializeSucceed();
  }).timeout(5000);

  function assertInitializeSucceed() {
    // Assert get cached packages
    assert.calledOnceWithExactly(readFile, packagesCacheUri);

    // Assert client get packages
    assert.calledOnce(pypiClient.getPackages);

    // Assert cache packages
    assert.calledOnceWithExactly(writeFile, packagesCacheUri, packagesBytes);

    // Join path should be called twice, reading and writing the cache
    assert.calledWithExactly(joinPath, globalStoragePath, packagesCacheName);
    assert.calledTwice(joinPath);
  }
});
