import { Uri, workspace } from "vscode";
import { CachePackage, CachePackageData } from "./types";

export class CacheService {
  private static packagesCacheName = "packages-cache.json";

  private globalStoragePath: Uri;

  constructor(globalStoragePath: Uri) {
    this.globalStoragePath = globalStoragePath;
  }

  private get packagesCacheUri(): Uri {
    return Uri.joinPath(this.globalStoragePath, CacheService.packagesCacheName);
  }

  async getPackages(): Promise<CachePackageData> {
    try {
      const bytes = await workspace.fs.readFile(this.packagesCacheUri);
      const contents = new TextDecoder().decode(bytes);
      return JSON.parse(contents) as CachePackageData;
    } catch (e) {}
    return { packages: [] };
  }

  async updatePackages(packages: Iterable<CachePackage>) {
    const cachePackageList = await this.getPackages();
    const newPackages = [...cachePackageList.packages, ...packages].filter(
      (value, index, self) =>
        index ===
        self.findIndex((cachePackage) => cachePackage.name === value.name)
    );
    cachePackageList.packages = newPackages;

    const byptes = new TextEncoder().encode(JSON.stringify(cachePackageList));
    await workspace.fs.writeFile(this.packagesCacheUri, byptes);
  }
}
