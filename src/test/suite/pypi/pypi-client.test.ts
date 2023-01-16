/* eslint-disable @typescript-eslint/naming-convention */
import { Axios } from "axios";
import { afterEach, beforeEach } from "mocha";
import {
  restore,
  assert,
  createStubInstance,
  SinonStubbedInstance,
} from "sinon";
import { PypiClient } from "../../../pypi/pypi-client";

suite("PypiClient", () => {
  const simpleResponse = {
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
    axios.get.returns(Promise.resolve(simpleResponse));

    const actual = await sut.getPackages();

    assert.match(actual, simpleResponse);
    assert.calledOnceWithExactly(axios.get, "/simple", {
      headers: { accept: "application/vnd.pypi.simple.v1+json" },
    });
  });
});
