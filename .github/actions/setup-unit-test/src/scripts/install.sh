setup() {
    step_log "Setup PHP"

    add_log "${tick:?}" "$version"
}

# 获取参数
version=$1
dist=$2

# 加载common.sh
. "${dist}"/../src/scripts/common.sh

setup
