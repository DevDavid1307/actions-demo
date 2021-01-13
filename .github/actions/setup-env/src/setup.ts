import * as core from '@actions/core'

export async function setup(): Promise<void> {
    try {
        const version = core.getInput('php-version')

        console.log(version)
    } catch(error) {
        core.setFailed(error.message)
    }
}

setup()
