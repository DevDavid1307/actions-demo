setup() {
    step_log "Setup PHP"

    add_log "${tick:?}" "$version"
}

# 获取参数
version=$1

# 加载common.sh
. ./common.sh

setup
