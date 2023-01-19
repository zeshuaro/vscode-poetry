import { Axios } from "axios";
import { PypiSimple } from "./types";

export class PypiClient {
  private static baseUrl = "https://pypi.org";

  /* istanbul ignore next */
  static default() {
    return new this(new Axios({ baseURL: PypiClient.baseUrl }));
  }

  private axios: Axios;

  constructor(axios: Axios) {
    this.axios = axios;
  }

  getPackages() {
    return this.axios.get<PypiSimple>("/simple", {
      headers: { accept: "application/vnd.pypi.simple.v1+json" },
    });
  }
}
