import { afterEach, beforeEach } from "mocha";
import { assert, restore, SinonStub, stub } from "sinon";
import { commands, ExtensionContext } from "vscode";
import { activate } from "../../extension";
import { PypiClient } from "../../pypi";
import { PypiService } from "../../pypi/pypi-service";
import { PoetryService } from "../../poetry-service";
import { ExtensionService } from "../../extension-service";

suite("Extension", () => {
  const numExtensions = 12;

  let context: ExtensionContext;
  let subscriptions: [];
  let registerCommand: SinonStub;

  beforeEach(() => {
    subscriptions = [];
    context = { subscriptions } as unknown as ExtensionContext;

    stub(PypiClient, "default");
    stub(PypiService.prototype);
    stub(PoetryService.prototype);
    stub(ExtensionService.prototype);

    registerCommand = stub(commands, "registerCommand");
  });

  afterEach(() => {
    restore();
  });

  test("activate", async () => {
    activate(context);

    assert.match(subscriptions.length, numExtensions);
    assert.callCount(registerCommand, numExtensions);
  });
});
