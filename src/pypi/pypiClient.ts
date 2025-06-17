import { Axios } from "axios";
import type { PypiSimple } from "./types";

export class PypiClient {
  private static baseUrl = "https://pypi.org";

  /* istanbul ignore next */
  static default() {
    return new PypiClient(new Axios({ baseURL: PypiClient.baseUrl }));
  }

  private axios: Axios;

  constructor(axios: Axios) {
    this.axios = axios;
  }

  async getPackages() {
    const res = await this.axios.get<PypiSimple>("/simple", {
      headers: { accept: "application/vnd.pypi.simple.v1+json" },
      // Axios doesn't transform the data automatically
      transformResponse: (data) => {
        /* istanbul ignore next */
        return JSON.parse(data);
      },
    });
    return res.data;
  }
}
