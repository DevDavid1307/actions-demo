import * as fs from 'fs'
import * as path from "path";
import * as core from '@actions/core'

export async function readScript(filename:string): Promise<string> {
   return fs.readFileSync(
       path.join(__dirname, "../src/scripts/"+filename),
       "utf8"
   )
}

/**
 * 解析php版本
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
 * 把拼装好的shell脚本写入一个临时目录
 *
 * @param filename
 * @param script
 */
export async function writeScript(filename: string, script: string): Promise<string> {
    const runner_dir: string = core.getInput("RUNNER_TOOL_CACHE")
    const script_path: string = path.join(runner_dir, filename);

    fs.writeFileSync(script_path, script, { mode: 0o755 });

    return script_path;
}

/**
 * 拼装通过pecl安装扩展的命令
 *
 * @param pecl
 */
export async function peclScript(pecl: string): Promise<string> {
    return "\nadd_pecl_extension psr"
}

/**
 * 拼装开启扩展的命令
 *
 * @param ext
 */
export async function extScript(ext: string): Promise<string> {
    // todo 暂时不需要

    return ""
}

/**
 * 拼装安装工具的命令
 *
 * @param tools
 */
export async function toolsScript(tools: string): Promise<string> {
    // todo 暂时不需要

    return "\nadd_tool https://cs.symfony.com/download/php-cs-fixer-v2.phar php-cs-fixer"
}
