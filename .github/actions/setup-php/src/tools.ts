import * as utils from "./utils";

/**
 * 解析版本，根据标准化规则
 *
 * @see https://semver.org/
 * @param version
 */
export async function getToolVersion(version: string): Promise<string> {
  const semver_regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  const composer_regex = /^stable$|^preview$|^snapshot$|^v?[1|2]$/;
  version = version.replace(/[><=^]*/, "");
  switch (true) {
    case version.charAt(0) == "v":
      return version.replace("v", "");
    case composer_regex.test(version):
    case semver_regex.test(version):
      return version;
    default:
      return "latest";
  }
}

/**
 * Function to parse tool:version
 *
 * @param release
 */
export async function parseTool(release: string): Promise<{ name: string; version: string }> {
  const parts: string[] = release.split(":");
  const tool: string = parts[0];
  const version: string | undefined = parts[1];
  switch (version) {
    case undefined:
      return {
        name: tool,
        version: "latest",
      };
    default:
      return {
        name: tool,
        version: await getToolVersion(parts[1]),
      };
  }
}

/**
 * Function to get the url of tool with the given version
 *
 * @param tool
 * @param extension
 * @param version
 * @param prefix
 * @param version_prefix
 * @param verb
 */
export async function getUri(
  tool: string,
  extension: string,
  version: string,
  prefix: string,
  version_prefix: string,
  verb: string
): Promise<string> {
  switch (version) {
    case "latest":
      return [prefix, version, verb, tool + extension]
        .filter(Boolean)
        .join("/");
    default:
      return [prefix, verb, version_prefix + version, tool + extension]
        .filter(Boolean)
        .join("/");
  }
}

/**
 * Function to get the phar url in domain/tool-version.phar format
 *
 * @param domain
 * @param tool
 * @param prefix
 * @param version
 */
export async function getPharUrl(
  domain: string,
  tool: string,
  prefix: string,
  version: string
): Promise<string> {
  switch (version) {
    case "latest":
      return domain + "/" + tool + ".phar";
    default:
      return domain + "/" + tool + "-" + prefix + version + ".phar";
  }
}

/**
 * Function to add/move composer in the tools list
 *
 * @param tools_list
 */
export async function addComposer(tools_list: string[]): Promise<string[]> {
  const regex_any = /^composer($|:.*)/;
  const regex_valid = /^composer:?($|preview$|snapshot$|v?[1-2]$|v?\d+\.\d+\.\d+[\w-]*$)/;
  const matches: string[] = tools_list.filter((tool) => regex_valid.test(tool));
  let composer = "composer";
  tools_list = tools_list.filter((tool) => !regex_any.test(tool));
  switch (true) {
    case matches[0] == undefined:
      break;
    default:
      composer = matches[matches.length - 1].replace(/v(\d\S*)/, "$1");
      break;
  }
  tools_list.unshift(composer);
  return tools_list;
}

/**
 * Function to get composer URL for a given version
 *
 * @param version
 */
export async function getComposerUrl(version: string): Promise<string> {
  let cache_url = `https://github.com/shivammathur/composer-cache/releases/latest/download/composer-${version.replace(
    "latest",
    "stable"
  )}.phar`;
  switch (true) {
    case /^snapshot$/.test(version):
      return `${cache_url},https://getcomposer.org/composer.phar`;
    case /^preview$|^[1-2]$/.test(version):
      return `${cache_url},https://getcomposer.org/composer-${version}.phar`;
    case /^\d+\.\d+\.\d+[\w-]*$/.test(version):
      cache_url = `https://github.com/composer/composer/releases/download/${version}/composer.phar`;
      return `${cache_url},https://getcomposer.org/composer-${version}.phar`;
    default:
      return `${cache_url},https://getcomposer.org/composer-stable.phar`;
  }
}

/**
 * Function to get Tools list after cleanup
 *
 * @param tools_csv
 */
export async function getCleanedToolsList(tools_csv: string): Promise<string[]> {
  let tools_list: string[] = await utils.CSVArray(tools_csv);
  tools_list = await addComposer(tools_list);
  tools_list = tools_list
    .map(function (extension: string) {
      return extension
        .trim()
        .replace(
          /-agent|behat\/|hirak\/|icanhazstring\/|laravel\/|narrowspark\/automatic-|overtrue\/|phpspec\/|robmorgan\/|symfony\//,
          ""
        );
    })
    .filter(Boolean);
  return [...new Set(tools_list)];
}

/**
 * Helper function to get script to setup a tool using a phar url
 *
 * @param tool
 * @param url
 * @param ver_param
 */
export async function addArchive(tool: string, url: string, ver_param: string): Promise<string> {
  return (
    (await utils.getCommand("tool")) +
    (await utils.joins(url, tool, ver_param))
  );
}

/**
 * Setup tools
 *
 * @param tools_csv
 */
export async function addTools(tools_csv: string): Promise<string> {
  let script = "\n" + (await utils.stepLog("Setup Tools"));

  const tools_list: Array<string> = await getCleanedToolsList(tools_csv);

  await utils.asyncForEach(tools_list, async function (release: string) {
    const tool_data: { name: string; version: string } = await parseTool(release);

    script += "\n" + await chooseTool(tool_data);
  });

  return script;
}

/**
 * 判断需要添加的tool，返回下载命令
 *
 * @param tool_data
 */
export async function chooseTool(tool_data: {name: string, version: string}): Promise<string> {
    const tool: string = tool_data.name;
    const version: string = tool_data.version;

    let url = ""

    switch (tool) {
        case "composer":
            url = await getComposerUrl(version);

            return await addArchive("composer", url, version);
        case "php-cs-fixer":
            const uri = await getUri(tool, ".phar", version, "releases", "v", "download");
            url = "https://github.com/FriendsOfPHP/PHP-CS-Fixer/" + uri;

            return await addArchive(tool, url, '"-V"');
        case "phpunit":
            url = await getPharUrl("https://phar.phpunit.de", tool, "", version);

            return await addArchive(tool, url, '"--version"');
        default:
            return await utils.addLog(
                "$cross",
                tool,
                "Tool " + tool + " is not supported",
            );
    }
}
