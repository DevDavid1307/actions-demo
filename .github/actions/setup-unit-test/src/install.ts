import * as exec from '@actions/exec'
import * as utils from './utils'
import * as core from '@actions/core'
import path from "path";

export async function run(): Promise<void> {
    const version = await utils.parseVersion(core.getInput("php-version"))

    await exec.exec('bash', [path.join(__dirname, "../src/scripts/install.sh"), version, __dirname])
}

run().catch(r => console.log(r))
