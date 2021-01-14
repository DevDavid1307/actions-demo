import { exec } from "@actions/exec/lib/exec";
import * as core from "@actions/core";
import * as config from "./config";
import * as coverage from "./coverage";
import * as extensions from "./extensions";
import * as tools from "./tools";
import * as utils from "./utils";

/**
 * Run the script
 */
export async function run(): Promise<void> {
    try {
        const version: string = await utils.parseVersion(
            await utils.getInput("php-version", true)
        );

        const location = await getScript(version);

        // 运行脚本
        await exec(await utils.joins('bash', location, version, __dirname));
    } catch (error) {
        core.setFailed(error.message);
    }
}

/**
 * Build the script
 *
 * @param version
 */
export async function getScript(version: string): Promise<string> {
    const script_name = 'env' + (await utils.scriptExtension());

    process.env["fail_fast"] = await utils.getInput("fail-fast", false);

    let script: string = await utils.readScript(script_name);

    // 解析自定义的一些扩展和工具，追加到脚本中
    script += await customCmd(version)

    console.log((script))

    // 把准备好的命令重新写回文件
    return await utils.writeScript(script_name, script);
}

/**
 * 解析需要安装的工具和扩展、版本等自定义信息
 *
 * @param version
 */
export async function customCmd(version: string): Promise<string> {
    let script = ''

    const extension_csv: string = await utils.getInput("extensions", false);
    const ini_values_csv: string = await utils.getInput("ini-values", false);
    const coverage_driver: string = await utils.getInput("coverage", false);
    const tools_csv: string = await utils.getInput("tools", false);

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

    return script
}

// call the run function
run();
