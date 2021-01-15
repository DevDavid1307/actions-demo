import * as exec from '@actions/exec'

export async function run(): Promise<void> {
    await exec.exec('bash', ['../scripts/install.sh'])
}

run()
