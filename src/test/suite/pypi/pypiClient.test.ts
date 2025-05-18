/* eslint-disable @typescript-eslint/naming-convention */
import { Axios, AxiosResponse } from "axios";
import { afterEach, beforeEach } from "mocha";
import {
  SinonStubbedInstance,
  assert,
  createStubInstance,
  match,
  restore,
  stub,
} from "sinon";
import { PypiClient } from "../../../pypi/pypiClient";

suite("PypiClient", () => {
  const axiosRes = <AxiosResponse>{ data: undefined };
  const packages = {
    meta: {
      "_last-serial": 16434683,
      "api-version": "1.0",
    },
    projects: [
      {
        "_last-serial": 3075854,
        name: "projectA",
      },
      {
        "_last-serial": 1448421,
        name: "projectB",
      },
    ],
  };

  let axios: SinonStubbedInstance<Axios>;
  let sut: PypiClient;

  beforeEach(() => {
    axios = createStubInstance(Axios);
    sut = new PypiClient(axios);
  });

  afterEach(() => {
    restore();
  });

  test("get packages", async () => {
    stub(axiosRes, "data").value(packages);
    axios.get.returns(Promise.resolve(axiosRes));

    const actual = await sut.getPackages();

    assert.match(actual, packages);
    assert.calledWithMatch(
      axios.get,
      "/simple",
      match({
        headers: { accept: "application/vnd.pypi.simple.v1+json" },
      })
    );
  });
});
