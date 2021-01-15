import * as exec from '@actions/exec'
import * as utils from './utils'

export async function run(): Promise<void> {
    const script = await utils.readScript("env.sh")

    await exec.exec('bash', [script])
}

run()
