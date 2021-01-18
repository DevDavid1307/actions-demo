import * as exec from '@actions/exec'
import * as utils from './utils'
import * as core from '@actions/core'
import * as github from '@actions/github'

export async function run(): Promise<void> {
    const version = await utils.parseVersion(core.getInput("php-version"))

    // todo 拼装扩展、工具的安装命令
    const file_name = "install.sh"
    const script = await utils.readScript(file_name) + await getScript()
    const install_script_path = await utils.writeScript(file_name, script)

    const params: string[] = [
        install_script_path,
        version,
        __dirname, // 项目路径，方便去加载其它sh文件
    ]

    await exec.exec('bash', params)
}

export async function getScript(): Promise<string> {
    const pecl = core.getInput("pecl-ext")
    const ext = core.getInput("extensions")
    const tools = core.getInput("tools")

    return await utils.peclScript(pecl) +
        await utils.extScript(ext) +
        await utils.toolsScript(tools)
}

run().catch(r => console.log(r))
