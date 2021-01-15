import * as exec from '@actions/exec'
import * as utils from './utils'
import * as core from '@actions/core'
import path from "path";

export async function run(): Promise<void> {
    const version = await utils.parseVersion(core.getInput("php-version"))
    const pecl = core.getInput("pecl-ext")
    const extensions = core.getInput("extensions")
    const tools = core.getInput("tools")

    // todo 拼装扩展、工具的安装命令
    const file_name = "install.sh"
    const script_file = path.join(__dirname, "../src/scripts/"+file_name)

    let script = await utils.readScript(script_file)
    script += await getScript()

    const install_script_path = await utils.writeScript(file_name, script)

    console.log(install_script_path)

    const params: string[] = [
        install_script_path,
        version,
        __dirname, // 项目路径，方便去加载其它sh文件
        pecl,
        extensions,
        tools
    ]

    await exec.exec('bash', params)
}

export async function getScript(): Promise<string> {
    return "\nadd_pecl_extension psr"
}

run().catch(r => console.log(r))
