import { Uri, workspace } from "vscode";
import { PypiClient } from "./pypi-client";
import { PypiProject, PypiSimple } from "./types";
import Fuse from "fuse.js";

export class PypiService {
  private static packagesCacheName = "packages-cache.json";

  private globalStoragePath: Uri;
  private pypiClient: PypiClient;
  private projectsFuse: Fuse<PypiProject> | undefined;

  constructor(globalStoragePath: Uri, pypiClient: PypiClient) {
    this.globalStoragePath = globalStoragePath;
    this.pypiClient = pypiClient;

    this.loadAndGetPackages();
  }

  searchPackages(query: string): PypiProject[] | undefined {
    if (this.projectsFuse) {
      return this.projectsFuse
        .search(query, { limit: 10 })
        .map((result) => result.item);
    }
    return undefined;
  }

  clearProjectsFuse() {
    this.projectsFuse = undefined;
  }

  private get packagesCacheUri(): Uri {
    return Uri.joinPath(this.globalStoragePath, PypiService.packagesCacheName);
  }

  private async loadAndGetPackages() {
    const packages = await this.getCachedPackages();
    if (packages) {
      this.projectsFuse = this.getProjectsFuse(packages);
    }
    await this.getAndCachePackages();
  }

  private async getCachedPackages(): Promise<PypiSimple | undefined> {
    try {
      const bytes = await workspace.fs.readFile(this.packagesCacheUri);
      const packagesStr = new TextDecoder().decode(bytes);
      return JSON.parse(packagesStr) as PypiSimple;
    } catch (e) {}
    return undefined;
  }

  private getProjectsFuse(packages: PypiSimple) {
    return new Fuse(packages.projects, {
      minMatchCharLength: 2,
      keys: ["name"],
    });
  }

  private async getAndCachePackages() {
    try {
      const packages = await this.pypiClient.getPackages();
      await this.cachePackages(packages);
      this.projectsFuse = this.getProjectsFuse(packages);
    } catch (e) {}
  }

  private cachePackages(packages: PypiSimple) {
    const packagesStr = JSON.stringify(packages);
    const bytes = new TextEncoder().encode(packagesStr);
    return workspace.fs.writeFile(this.packagesCacheUri, bytes);
  }
}
