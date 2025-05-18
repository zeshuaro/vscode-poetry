import { afterEach, beforeEach } from "mocha";
import { SinonStub, assert, restore, stub } from "sinon";
import { ExtensionContext, commands } from "vscode";
import { activate } from "../../extension";
import { ExtensionService } from "../../extensionService";
import { PoetryService } from "../../poetry/poetryService";
import { PypiClient } from "../../pypi";
import { PypiService } from "../../pypi/pypiService";

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
