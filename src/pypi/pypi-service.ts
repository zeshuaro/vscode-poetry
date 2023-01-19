import { Uri, workspace } from "vscode";
import { PypiClient } from "./pypi-client";
import { PypiSimple } from "./types";

export class PypiService {
  private static packagesCacheName = "packages-cache.json";

  private globalStoragePath: Uri;
  private pypiClient: PypiClient;
  private packages: PypiSimple | undefined;

  constructor(
    globalStoragePath: Uri,
    pypiClient: PypiClient
    // bypassLoadPackages: boolean = false
  ) {
    this.globalStoragePath = globalStoragePath;
    this.pypiClient = pypiClient;

    this.loadAndGetPackages();
  }

  private get packagesCacheUri(): Uri {
    return Uri.joinPath(this.globalStoragePath, PypiService.packagesCacheName);
  }

  private async loadAndGetPackages() {
    this.packages = await this.getCachedPackages();
    this.getAndCachePackages();
  }

  private async getCachedPackages(): Promise<PypiSimple | undefined> {
    try {
      const bytes = await workspace.fs.readFile(this.packagesCacheUri);
      const packagesStr = new TextDecoder().decode(bytes);
      return JSON.parse(packagesStr) as PypiSimple;
    } catch (e) {}
    return undefined;
  }

  private async getAndCachePackages() {
    try {
      const packages = await this.pypiClient.getPackages();
      await this.cachePackages(packages);
      this.packages = packages;
    } catch (e) {}
  }

  private cachePackages(packages: PypiSimple) {
    const packagesStr = JSON.stringify(packages);
    const bytes = new TextEncoder().encode(packagesStr);
    return workspace.fs.writeFile(this.packagesCacheUri, bytes);
  }
}
