import * as utils from "./utils";
import * as extensions from "./extensions";
import * as config from "./config";

/**
 * Function to setup Xdebug
 *
 * @param extension
 * @param version
 * @param pipe
 */
export async function addCoverageXdebug(
  extension: string,
  version: string,
  pipe: string
): Promise<string> {
  const xdebug =
    (await extensions.addExtension(extension, version, true)) +
    pipe;
  const log = await utils.addLog(
    "$tick",
    extension,
    "Xdebug enabled as coverage driver",
  );
  return xdebug + "\n" + log;
}

/**
 * Function to set coverage driver
 *
 * @param coverage_driver
 * @param version
 */
export async function addCoverage(
  coverage_driver: string,
  version: string,
): Promise<string> {
  coverage_driver = coverage_driver.toLowerCase();
  const script: string =
    "\n" + (await utils.stepLog("Setup Coverage"));
  const pipe: string = await utils.suppressOutput();
  switch (coverage_driver) {
    case "xdebug":
    case "xdebug3":
      return (
        script + (await addCoverageXdebug("xdebug", version, pipe))
      );
    case "xdebug2":
      return (
        script + (await addCoverageXdebug("xdebug2", version, pipe))
      );
    default:
      return "";
  }
}
