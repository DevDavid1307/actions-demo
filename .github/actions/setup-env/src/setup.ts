import * as core from '@actions/core'
import * as utils from './utils'
import * as tools from './tools'

export async function setup(): Promise<void> {
    try {
        const version = core.getInput('php-version')
        const os_version: string = process.platform
        const script = os_version + await utils.scriptExtension(os_version)
        const location = await getScript(script, version, os_version);

        location
    } catch(error) {
        core.setFailed(error.message)
    }
}

async function getScript(file_name: string, version: string, os_version:string): Promise<string> {
    // const ext: string = 'psr'

    // todo
    version
    os_version

    const tools_csv = 'php-cs-fixer, composer:v2'

    let script: string = await utils.readScript(file_name)
    script += await tools.addTools(tools_csv, version, os_version);

    return script
}

setup()
