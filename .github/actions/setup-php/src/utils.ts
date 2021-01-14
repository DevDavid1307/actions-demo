import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";

/**
 * Function to read environment variable and return a string value.
 *
 * @param property
 */
export async function readEnv(property: string): Promise<string> {
  const value = process.env[property];
  switch (value) {
    case undefined:
      return "";
    default:
      return value;
  }
}

/**
 * Function to get inputs from both with and env annotations.
 *
 * @param name
 * @param mandatory
 */
export async function getInput(
  name: string,
  mandatory: boolean
): Promise<string> {
  const input = core.getInput(name);
  const env_input = await readEnv(name);
  switch (true) {
    case input != "":
      return input;
    case input == "" && env_input != "":
      return env_input;
    case input == "" && env_input == "" && mandatory:
      throw new Error(`Input required and not supplied: ${name}`);
    default:
      return "";
  }
}

/**
 * Function to parse PHP version.
 *
 * @param version
 */
export async function parseVersion(version: string): Promise<string> {
  switch (version) {
    case "latest":
      return "8.0";
    default:
      switch (true) {
        case version.length > 1:
          return version.slice(0, 3);
        default:
          return version + ".0";
      }
  }
}

/**
 * Async foreach loop
 *
 * @author https://github.com/Atinux
 * @param array
 * @param callback
 */
export async function asyncForEach(
  array: Array<string>,
  callback: (
    element: string,
    index: number,
    array: Array<string>
  ) => Promise<void>
): Promise<void> {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * Get color index
 *
 * @param type
 */
export async function color(type: string): Promise<string> {
  switch (type) {
    case "error":
      return "31";
    default:
    case "success":
      return "32";
    case "warning":
      return "33";
  }
}

/**
 * Log to console
 *
 * @param message
 * @param log_type
 */
export async function log(message: string, log_type: string): Promise<string> {
    return 'echo "\\033[' + (await color(log_type)) + ";1m" + message + '\\033[0m"'
}

/**
 * Function to log a step
 *
 * @param message
 */
export async function stepLog(message: string): Promise<string> {
    return 'step_log "' + message + '"';
}

/**
 * Function to log a result
 * @param mark
 * @param subject
 * @param message
 */
export async function addLog(mark: string, subject: string, message: string): Promise<string> {
    return 'add_log "' + mark + '" "' + subject + '" "' + message + '"';
}

/**
 * Read the scripts
 *
 * @param filename
 */
export async function readScript(filename: string): Promise<string> {
  return fs.readFileSync(
    path.join(__dirname, "../src/scripts/" + filename),
    "utf8"
  );
}

/**
 * Write final script which runs
 *
 * @param filename
 * @param script
 */
export async function writeScript(filename: string, script: string): Promise<string> {
  const runner_dir: string = await getInput("RUNNER_TOOL_CACHE", false);
  const script_path: string = path.join(runner_dir, filename);

  fs.writeFileSync(script_path, script, { mode: 0o755 });

  return script_path;
}

/**
 * Function to break extension csv into an array
 *
 * @param extension_csv
 */
export async function extensionArray(extension_csv: string): Promise<Array<string>> {
  switch (extension_csv) {
    case "":
    case " ":
      return [];
    default:
      return extension_csv
        .split(",")
        .map(function (extension: string) {
          return extension
            .trim()
            .toLowerCase()
            .replace(/^php[-_]/, "");
        })
        .filter(Boolean);
  }
}

/**
 * Function to break csv into an array
 *
 * @param values_csv
 * @constructor
 */
export async function CSVArray(values_csv: string): Promise<Array<string>> {
  switch (values_csv) {
    case "":
    case " ":
      return [];
    default:
      return values_csv
        .split(/,(?=(?:(?:[^"']*["']){2})*[^"']*$)/)
        .map(function (value) {
          return value.trim().replace(/^["']|["']$|(?<==)["']/g, "");
        })
        .filter(Boolean);
  }
}

/**
 * Function to get prefix required to load an extension.
 *
 * @param extension
 */
export async function getExtensionPrefix(extension: string): Promise<string> {
  switch (true) {
    default:
      return "extension";
    case /xdebug([2-3])?$|opcache|ioncube|eaccelerator/.test(extension):
      return "zend_extension";
  }
}

/**
 * Function to get the suffix to suppress console output
 */
export async function suppressOutput(): Promise<string> {
    return " >/dev/null 2>&1";
}

/**
 * Function to get script to log unsupported extensions.
 *
 * @param extension
 * @param version
 */
export async function getUnsupportedLog(extension: string, version: string): Promise<string> {
  return (
    "\n" +
    (await addLog(
      "$cross",
      extension,
      [extension, "is not supported on PHP", version].join(" "),
    )) +
    "\n"
  );
}

/**
 * Function to get command to setup tools
 *
 * @param suffix
 */
export async function getCommand(suffix: string): Promise<string> {
    return "add_" + suffix + " ";
}

/**
 * Function to join strings with space
 *
 * @param str
 */
export async function joins(...str: string[]): Promise<string> {
  return [...str].join(" ");
}

/**
 * Function to get script extensions
 */
export async function scriptExtension(): Promise<string> {
    return ".sh";
}

/**
 * Function to get script to add tools with custom support.
 *
 * @param pkg
 * @param type
 * @param version
 */
export async function customPackage(
  pkg: string,
  type: string,
  version: string,
): Promise<string> {
  const pkg_name: string = pkg.replace(/\d+|pdo[_-]/, "");
  const script_extension: string = await scriptExtension();
  const script: string = path.join(
    __dirname,
    "../src/scripts/" + type + "/" + pkg_name + script_extension
  );
  const command: string = await getCommand(pkg_name);
  return "\n. " + script + "\n" + command + version;
}
