/* eslint-disable @typescript-eslint/naming-convention */
import { afterEach, beforeEach } from "mocha";
import {
  assert,
  type SinonStub,
  type SinonStubbedInstance,
  createStubInstance,
  restore,
  stub,
} from "sinon";
import { type FileSystem, Uri, workspace } from "vscode";
import { PypiClient, PypiService, type PypiSimple } from "../../../pypi";
import type { PypiProject } from "../../../pypi/types";

suite("PypiService", () => {
  const packagesCacheName = "packages-cache.json";
  const textEncoder = new TextEncoder();

  const project: PypiProject = { "_last-serial": 123, name: "packageA" };
  const packages: PypiSimple = {
    meta: {
      "_last-serial": 123,
      "api-version": "v1",
    },
    projects: [project],
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
    // eslint-disable-next-line no-new
    new PypiService(globalStoragePath, pypiClient);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    assertInitializeSucceed();
  });

  test("initialize get cache error", async () => {
    readFile.throws();

    // eslint-disable-next-line no-new
    new PypiService(globalStoragePath, pypiClient);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    assertInitializeSucceed();
  });

  test("initialize get packages error", async () => {
    pypiClient.getPackages.throws();

    // eslint-disable-next-line no-new
    new PypiService(globalStoragePath, pypiClient);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    assertInitializeSucceed({ assertWriteCache: false });
  });

  test("search packages", async () => {
    const sut = new PypiService(globalStoragePath, pypiClient);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const actual = sut.searchPackages(project.name);

    assert.match(actual, [project]);
  });

  test("search packages without cache", async () => {
    const sut = new PypiService(globalStoragePath, pypiClient);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    sut.clearProjectsFuse();
    const actual = sut.searchPackages(project.name);

    assert.match(actual, undefined);
  });

  function assertInitializeSucceed({ assertWriteCache = true } = {}) {
    // Assert get cached packages
    assert.calledOnceWithExactly(readFile, packagesCacheUri);

    // Assert client get packages
    assert.calledOnce(pypiClient.getPackages);

    // Assert cache packages
    if (assertWriteCache) {
      assert.calledOnceWithExactly(writeFile, packagesCacheUri, packagesBytes);
    }

    // Join path should be called twice if we wrote into cache, reading and writing the cache
    joinPath
      .getCall(0)
      .calledWithExactly(joinPath, globalStoragePath, packagesCacheName);
    if (assertWriteCache) {
      joinPath
        .getCall(1)
        .calledWithExactly(joinPath, globalStoragePath, packagesCacheName);
    }
  }
}).timeout(5000);
