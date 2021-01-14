import { exec } from "@actions/exec/lib/exec";
import * as core from "@actions/core";
import * as config from "./config";
import * as coverage from "./coverage";
import * as extensions from "./extensions";
import * as tools from "./tools";
import * as utils from "./utils";

/**
 * Build the script
 *
 * @param filename
 * @param version
 */
export async function getScript(filename: string, version: string): Promise<string> {
  // taking inputs
  process.env["fail_fast"] = await utils.getInput("fail-fast", false);

  const extension_csv: string = await utils.getInput("extensions", false);
  const ini_values_csv: string = await utils.getInput("ini-values", false);
  const coverage_driver: string = await utils.getInput("coverage", false);
  const tools_csv: string = await utils.getInput("tools", false);

  let script: string = await utils.readScript(filename);
  script += await tools.addTools(tools_csv);

  if (extension_csv) {
    script += await extensions.addExtension(extension_csv, version);
  }

  if (coverage_driver) {
    script += await coverage.addCoverage(coverage_driver, version);
  }

  if (ini_values_csv) {
    script += await config.addINIValues(ini_values_csv);
  }

  return await utils.writeScript(filename, script);
}

/**
 * Run the script
 */
export async function run(): Promise<void> {
  try {
    const version: string = await utils.parseVersion(
      await utils.getInput("php-version", true)
    );

    const script = 'env' + (await utils.scriptExtension());
    const location = await getScript(script, version);

    await exec(await utils.joins('bash', location, version, __dirname));
  } catch (error) {
    core.setFailed(error.message);
  }
}

// call the run function
run();
