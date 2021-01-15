import * as exec from '@actions/exec'
import * as utils from './utils'
import * as core from '@actions/core'
import path from "path";

export async function run(): Promise<void> {
    const version = await utils.parseVersion(core.getInput("php-version"))
    const pecl = core.getInput("pecl-ext")
    const extensions = core.getInput("extensions")
    const tools = core.getInput("tools")

    const params: string[] = [
        path.join(__dirname, "../src/scripts/install.sh"),
        version,
        __dirname, // 项目路径，方便去加载其它sh文件
        pecl,
        extensions,
        tools
    ]

    await exec.exec('bash', [path.join(__dirname, "../src/scripts/install.sh"), version, __dirname])
}

run().catch(r => console.log(r))
