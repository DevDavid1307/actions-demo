import * as exec from '@actions/exec'
import * as utils from './utils'
import path from "path";

export async function run(): Promise<void> {
    // const script = await utils.readScript("install.sh")

    await exec.exec('bash', [path.join(__dirname, "../src/scripts/install.sh")])
}

run()
