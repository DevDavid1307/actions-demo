import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'

export async function readScript(file_name: string): Promise<string> {
    return fs.readFileSync(
        path.join(__dirname, '../src/scripts/'+file_name),
        'utf8'
    )
}

export async function scriptExtension(os_version: string): Promise<string> {
    switch(os_version) {
        case 'linux':
            return '.sh'
        default:
            core.setFailed(`暂时不支持${os_version}`)
            return ""
    }
}

/**
 * Function to get command to setup tools
 *
 * @param os_version
 * @param suffix
 */
export function getCommand(
  os_version: string,
  suffix: string
): string {
  switch (os_version) {
    case 'linux':
    case 'darwin':
      return 'add_' + suffix + ' ';
    case 'win32':
      return 'Add-' + suffix.charAt(0).toUpperCase() + suffix.slice(1) + ' ';
    default:
        return ''
  }
}

/**
 * Function to join strings with space
 *
 * @param str
 */
export  function joins(...str: string[]): string {
  return [...str].join(' ');
}
