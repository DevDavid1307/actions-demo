tool_path_dir="/usr/local/bin"

setup() {
    step_log "设置php版本"
    sudo mkdir -m 777 -p /var/run /run/php # 创建php运行时目录

    # 如果系统内置的版本不是需要的
    if [ "$(php-config --version 2>/dev/null | cut -c 1-3)" != "$version" ]; then
            switch_version >/dev/null 2>&1

            status="切换到"
    else
        status="找到内置" # 内置版本就是需要的版本
    fi

    # 没有找到指定的php版本
    # todo 暂时不处理安装制定版本
    if ! command -v php"$version" >/dev/null; then
      add_log "${cross:?}" "PHP" "Could not setup PHP $version"
      exit 1
    fi

    add_log "${tick:?}" "PHP" "${status} PHP ${version}"
}

# add_pecl_extension 扩展名称 版本
add_pecl_extension() {
    step_log "通过Pecl安装扩展"

    ext=$1

    # 安装
    pecl_install "$ext"

    # 添加到php.ini
    ini_dir=$(php --ini | grep "(php.ini)" | sed -e "s|.*: s*||")

    echo "extension=$ext.so" | sudo tee -a "${ini_dir}/php.ini" >/dev/null

    add_log "${tick:?}" "$ext" "安装成功"
}

# add_tool 下载链接 工具名称
add_tool() {
    step_log "添加工具"

    url=$1
    tool=$2
    tool_path="$tool_path_dir/$tool"

    # 添加工具目录到系统变量
    if ! [[ "$PATH" =~ $tool_path_dir ]] ; then
      export PATH=$PATH:"$tool_path_dir"
      echo "export PATH=\$PATH:$tool_path_dir" | sudo tee -a "$GITHUB_ENV" >/dev/null
    fi

    # 如果存在，先删除
    if [ ! -e "$tool_path" ]; then
      rm -rf "$tool_path"
    fi

    # 下载，返回成功状态
    status_code=$(get -v -e "$tool_path" "$url")

    # 安装失败
    if [ "$status_code" != "200" ]; then
        add_log "$cross" "$tool" "安装失败"
    fi

    add_log "$tick" "$tool" "安装成功"
}

# 切换php版本
switch_version() {
  for tool in pear pecl php phar phar.phar php-cgi php-config phpize phpdbg; do
    if [ -e "/usr/bin/$tool$version" ]; then
      sudo update-alternatives --set $tool /usr/bin/"$tool$version" &
      to_wait+=($!)
    fi
  done
  wait "${to_wait[@]}"
}

# 获取参数
version=$1
dist=$2

# 加载common.sh
. "${dist}"/../src/scripts/common.sh

setup
