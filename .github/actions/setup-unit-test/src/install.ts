import * as exec from '@actions/exec'

export async function run(): Promise<void> {
    await exec.exec('bssh', ['../scripts/install.sh'])
}

run()