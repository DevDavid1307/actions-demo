export tick="✓"
export cross="✗"
export curl_opts=(-sL)

# 日志
step_log() {
  message=$1

  printf "\n\033[90;1m==> \033[0m\033[37;1m%s\033[0m\n" "$message"
}

# 日志
add_log() {
  mark=$1
  subject=$2
  message=$3
  if [ "$mark" = "$tick" ]; then
    printf "\033[32;1m%s \033[0m\033[34;1m%s \033[0m\033[90;1m%s\033[0m\n" "$mark" "$subject" "$message"
  else
    printf "\033[31;1m%s \033[0m\033[34;1m%s \033[0m\033[90;1m%s\033[0m\n" "$mark" "$subject" "$message" && exit 1
  fi
}

# 返回具体的php版本
php_semver() {
  php"${version:?}" -v | grep -Eo -m 1 "[0-9]+\.[0-9]+\.[0-9]+" | head -n 1
}

# 下载
# get -v -e path url
get() {
    mode=$1
    execute=$2
    file_path=$3
    shift 3 # 跳过3个参数，拿下载链接
    link=$1

    status_code=$(sudo curl -w "%{http_code}" -o "$file_path" "${curl_opts[@]}" "$link")

    [ "$execute" = "-e" ] && sudo chmod a+x "$file_path"
    [ "$mode" = "-v" ] && echo "$status_code"
}

# Function to install PECL extensions and accept default options
pecl_install() {
    local extension=$1

    yes '' 2>/dev/null | sudo pecl install -f "$extension" >/dev/null 2>&1
}

# Function to test if extension is loaded.
check_extension() {
    php -m | grep -i -q -w "$1"
}
