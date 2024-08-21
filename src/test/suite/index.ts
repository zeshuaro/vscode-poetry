import { sync } from "glob";
import Mocha from "mocha";
import { join, resolve } from "path";

function setupCoverage() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const NYC = require("nyc");
  const nyc = new NYC({
    cwd: join(__dirname, "..", "..", ".."),
    exclude: ["vscode-service.ts", "**/test/**", ".vscode-test/**"],
    reporter: ["text", "html", "lcov"],
    all: true,
    instrument: true,
    hookRequire: true,
    hookRunInContext: true,
    hookRunInThisContext: true,
  });

  nyc.reset();
  nyc.wrap();

  return nyc;
}

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  const testsRoot = resolve(__dirname, "..");
  const nyc = setupCoverage();
  const files = sync("**/**.test.js", { cwd: testsRoot });
  files.forEach((f) => mocha.addFile(resolve(testsRoot, f)));

  try {
    await new Promise<void>((resolve, reject) => {
      mocha.run((failures) => {
        return failures
          ? reject(new Error(`${failures} tests failed`))
          : resolve();
      });
    });
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    nyc.writeCoverageFile();
    await nyc.report();
  }
}
