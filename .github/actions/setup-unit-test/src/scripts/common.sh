export tick="✓"
export cross="✗"

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
    link=$#

    echo "下载: " "$mode" "$execute" "$file_path" "$link"
}
