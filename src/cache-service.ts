import { Memento } from "vscode";

export class CacheService {
  static packages = "packages";
  static emptyPackages = new Set<string>();

  private globalState: Memento;

  constructor(globalState: Memento) {
    this.globalState = globalState;
  }

  getPackages = () =>
    this.globalState.get<Set<string>>(
      CacheService.packages,
      CacheService.emptyPackages
    );

  updatePackages = (packages: Set<string>) => {
    const cachedPackages = this.getPackages();
    const newPackages = new Set([...cachedPackages, ...packages]);
    return this.globalState.update(CacheService.packages, newPackages);
  };
}
