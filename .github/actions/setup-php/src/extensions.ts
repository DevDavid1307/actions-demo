import * as utils from "./utils";

/**
 * Install and enable extensions for linux
 *
 * @param extension_csv
 * @param version
 */
export async function addExtensionLinux(
  extension_csv: string,
  version: string
): Promise<string> {
  const extensions: Array<string> = await utils.extensionArray(extension_csv);
  let add_script = "\n";
  let remove_script = "";
  await utils.asyncForEach(extensions, async function (extension: string) {
    const version_extension: string = version + extension;
    const [ext_name, ext_version]: string[] = extension.split("-");
    const ext_prefix = await utils.getExtensionPrefix(ext_name);
    switch (true) {
      // Match :extension
      case /^:/.test(ext_name):
        remove_script += "\nremove_extension " + ext_name.slice(1);
        return;
      case /^((5\.[3-6])|(7\.[0-2]))pdo_cubrid$|^((5\.[3-6])|(7\.[0-4]))cubrid$/.test(
        version_extension
      ):
      case /^pdo_oci$|^oci8$/.test(extension):
      case /^(5\.6|7\.[0-4]|8\.0)intl-[\d]+\.[\d]+$/.test(version_extension):
      case /^(5\.[3-6]|7\.[0-4])(ioncube|geos)$/.test(version_extension):
      case /^7\.[0-3]phalcon3$|^7\.[2-4]phalcon4$/.test(version_extension):
      case /^((5\.6)|(7\.[0-4]))(gearman|couchbase)$/.test(version_extension):
        add_script += await utils.customPackage(
          ext_name,
          "ext",
          extension,
        );
        return;
      // match pre-release versions. For example - xdebug-beta
      case /.*-(stable|beta|alpha|devel|snapshot|rc|preview)/.test(
        version_extension
      ):
        add_script += await utils.joins(
          "\nadd_unstable_extension",
          ext_name,
          ext_version,
          ext_prefix
        );
        return;
      // match semver versions
      case /.*-\d+\.\d+\.\d+.*/.test(version_extension):
        add_script += await utils.joins(
          "\nadd_pecl_extension",
          ext_name,
          ext_version,
          ext_prefix
        );
        return;
      // match 5.3pcov to 7.0pcov
      case /(5\.[3-6]|7\.0)pcov/.test(version_extension):
        add_script += await utils.getUnsupportedLog("pcov", version);
        return;
      // match 7.2xdebug2...7.4xdebug2
      case /^7\.[2-4]xdebug2$/.test(version_extension):
        add_script += await utils.joins(
          "\nadd_pecl_extension",
          "xdebug",
          "2.9.8",
          ext_prefix
        );
        return;
      // match pdo extensions
      case /.*pdo[_-].*/.test(version_extension):
        extension = extension.replace(/pdo[_-]|3/, "");
        add_script += "\nadd_pdo_extension " + extension;
        return;
      // match sqlite
      case /^sqlite$/.test(extension):
        extension = "sqlite3";
        break;
      default:
        break;
    }
    add_script += await utils.joins("\nadd_extension", extension, ext_prefix);
  });
  return add_script + remove_script;
}

/**
 * Install and enable extensions
 *
 * @param extension_csv
 * @param version
 * @param no_step
 */
export async function addExtension(extension_csv: string, version: string, no_step = false): Promise<string> {
  const log: string = await utils.stepLog("Setup Extensions");
  let script = "\n";
  switch (no_step) {
    case true:
      script += log + (await utils.suppressOutput());
      break;
    case false:
    default:
      script += log;
      break;
  }

  return script + (await addExtensionLinux(extension_csv, version));
}
