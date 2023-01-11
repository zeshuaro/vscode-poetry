import { afterEach, beforeEach } from "mocha";
import { assert, restore, SinonStub, stub } from "sinon";
import { commands, ExtensionContext } from "vscode";
import { activate } from "../../extension";

suite("Extension", () => {
  const numExtensions = 12;

  let context: ExtensionContext;
  let subscriptions: [];
  let registerCommand: SinonStub;

  beforeEach(() => {
    subscriptions = [];
    context = { subscriptions } as unknown as ExtensionContext;

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
