import { Uri, workspace } from "vscode";
import { PypiClient } from "./pypi-client";
import { PypiProject, PypiSimple } from "./types";
import Fuse from "fuse.js";

export class PypiService {
  private static packagesCacheName = "packages-cache.json";

  private globalStoragePath: Uri;
  private pypiClient: PypiClient;
  private packages: PypiSimple | undefined;

  constructor(globalStoragePath: Uri, pypiClient: PypiClient) {
    this.globalStoragePath = globalStoragePath;
    this.pypiClient = pypiClient;

    this.loadAndGetPackages();
  }

  searchPackages(query: string): PypiProject[] | undefined {
    if (this.packages) {
      const fuse = new Fuse(this.packages.projects, { keys: ["name"] });
      return fuse.search(query, { limit: 10 }).map((result) => result.item);
    }
    return undefined;
  }

  clearPackages() {
    this.packages = undefined;
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
