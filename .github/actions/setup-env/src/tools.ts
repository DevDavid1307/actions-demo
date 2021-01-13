import * as utils from './utils'
/**
 * 返回扩展安装命令，拼接到脚本中
 *
 * @param tools
 * @param php_version
 * @param os_version
 */
export async function addTools(tools: string, php_version: string,os_version: string): Promise<string> {
    let script = ""
    const github = 'https://github.com/'

    // todo
    github
    php_version

    // 解析需要安装的工具
    const toolsArr: Array<string> = await parseToolsToArr(tools)

    toolsArr.map(item => {
        const toolData = parseTool(item)
        const tool = toolData.name
        const version = toolData.version

        let url = ''
        let uri = ''

        switch(tool) {
            case 'php-cs-fixer':
                uri = getUri(tool, '.phar', version, 'releases', 'v', 'download');
                url = github + 'FriendsOfPHP/PHP-CS-Fixer/' + uri;
                script +=  addArchive(tool, url, os_version, '"-V"') + "\n";
            case 'compoer':
                url = getComposerUrl(version)
                script += addArchive('composer', url, os_version, version) + "\n"
        }
    })

    console.log(script)

    return script
}

export async function parseToolsToArr(tools:string): Promise<Array<string>> {
    const toolsArr = tools.split(',')

    return toolsArr.map(tool => tool.trim())
}

/**
 * 版本解析
 *
 * @param tool
 */
export function parseTool(tool:string): {name: string, version: string} {
    const parts = tool.split(':')
    const name = parts[0]
    const version: string | undefined = parts[1]

    // 使用默认版本号
    if (version == undefined) {
        return {name: name, version: 'latest'}
    }

    return {name: name, version: parseToolVersion(version)}
}

export function parseToolVersion(version: string): string {
  // semver_regex - https://semver.org/
  const semver_regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  const composer_regex = /^stable$|^preview$|^snapshot$|^v?[1|2]$/;
  version = version.replace(/[><=^]*/, '');

  switch (true) {
    case version.charAt(0) == 'v':
      return version.replace('v', '');
    case composer_regex.test(version):
    case semver_regex.test(version):
      return version;
    default:
      return 'latest';
  }
}

export function getComposerUrl(version: string): string {
  let cache_url = `https://github.com/shivammathur/composer-cache/releases/latest/download/composer-${version.replace(
    'latest',
    'stable'
  )}.phar`;
  switch (true) {
    case /^snapshot$/.test(version):
      return `${cache_url},https://getcomposer.org/composer.phar`;
    case /^preview$|^[1-2]$/.test(version):
      return `${cache_url},https://getcomposer.org/composer-${version}.phar`;
    case /^\d+\.\d+\.\d+[\w-]*$/.test(version):
      cache_url = `https://github.com/composer/composer/releases/download/${version}/composer.phar`;
      return `${cache_url},https://getcomposer.org/composer-${version}.phar`;
    default:
      return `${cache_url},https://getcomposer.org/composer-stable.phar`;
  }
}

export function addArchive(
  tool: string,
  url: string,
  os_version: string,
  ver_param: string
): string {
  return (
    (utils.getCommand(os_version, 'tool')) +
    (utils.joins(url, tool, ver_param))
  );
}

/**
 * Function to get the url of tool with the given version
 *
 * @param tool
 * @param extension
 * @param version
 * @param prefix
 * @param version_prefix
 * @param verb
 */
export  function getUri(
  tool: string,
  extension: string,
  version: string,
  prefix: string,
  version_prefix: string,
  verb: string
): string {
  switch (version) {
    case 'latest':
      return [prefix, version, verb, tool + extension]
        .filter(Boolean)
        .join('/');
    default:
      return [prefix, verb, version_prefix + version, tool + extension]
        .filter(Boolean)
        .join('/');
  }
}
