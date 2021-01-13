import Pr from './biz/pr'
import * as core from '@actions/core'

try {
  // 获取pr的labels
  const labels = new Pr().getLabels()

  // 获取需要包含的labels
  const allLabelsStr = core.getInput('modules')

  // no label
  if (labels.length == 0) {
    throw new Error(`至少包含${allLabelsStr}其中的一个标签`)
  }

  // 检测标签
  const allLabelsArr = allLabelsStr.split(',')

  const intersect = allLabelsArr.filter((label: string) => labels.indexOf(label.trim()) > -1)

  // 没有添加模块label
  if (intersect.length == 0) {
    throw new Error(`至少包含${allLabelsStr}其中的一个模块标签`)
  }
} catch (error) {
  core.setFailed(error.message)
}
