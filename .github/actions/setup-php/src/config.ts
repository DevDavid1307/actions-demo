import * as utils from "./utils";

/**
 * Add script to set custom ini values for unix
 *
 * @param ini_values_csv
 */
export async function addINIValuesUnix(
  ini_values_csv: string
): Promise<string> {
  const ini_values: Array<string> = await utils.CSVArray(ini_values_csv);
  let script = "";
  await utils.asyncForEach(ini_values, async function (line: string) {
    script +=
      "\n" + (await utils.addLog("$tick", line, "Added to php.ini"));
  });
  return (
    'echo "' +
    ini_values.join("\n") +
    '" | sudo tee -a "${pecl_file:-${ini_file[@]}}" >/dev/null 2>&1' +
    script
  );
}

/**
 * Function to add custom ini values
 *
 * @param ini_values_csv
 * @param no_step
 */
export async function addINIValues(
  ini_values_csv: string,
  no_step = false
): Promise<string> {
  let script = "\n";
  switch (no_step) {
    case true:
      script +=
        (await utils.stepLog("Add php.ini values")) +
        (await utils.suppressOutput()) +
        "\n";
      break;
    case false:
    default:
      script += (await utils.stepLog("Add php.ini values")) + "\n";
      break;
  }

  return script + (await addINIValuesUnix(ini_values_csv));
}
